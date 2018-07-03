const api = require('./api')
const Promise = require('bluebird')
const { filterFailing } = require('./transformations')
const { formatSteps } = require('./formatters')
const config = require('../../config.json')

// fetchStatus,
// Uses CircleCI Api to download and format the results of the
// latest build.
//
// If no builds were found, it sends back that the project might not be configured
// properly for CircleCI.
// If the latest build succeeded, it shows that it finished successfully.
// If the latest build shows as fixed, it suows that it finished successfully.
// If the latest build shows as queued, it waits a certain amount of time
// before trying again.
// If the latest build failed, it tries to fetch and format the output of the
// failing steps of the build.
//
const fetchStatus = async params => {
  // We are not deconstructing the params on the function delaratiib so we can
  // change the params while this function waits for the build to pass.
  let { owner, repo, branch } = params

  // Retrieving the latest builds for that owner/repo/branch
  let result = await api.lastBuilds({
    owner,
    repo,
    branch
  })

  if (!result.length)
    return `\n${
      config.smallHeader
    } This repository doesn't seem to be configured with CircleCI.`

  let [{ status, build_num }] = result

  if (status === 'success' || status === 'fixed')
    return `\n${config.smallHeader} CircleCI Passed! :clap::white_check_mark:`

  if (status === 'queued') {
    // Infinite Jest!
    await Promise.delay(config.circleCi.delay)
    return fetchStatus(params)
  }

  // Retrieving the details of the latest build
  let { steps } = await api.specificBuild({ owner, repo, build: build_num })

  // Formatting the failing steps of the build
  let failingSteps = filterFailing(steps)

  // And that's it!
  return `${config.header}\n${await formatSteps(failingSteps)}`
}

module.exports = {
  fetchStatus
}
