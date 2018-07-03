const api = require('./api')
const Promise = require('bluebird')
const { filterFailing } = require('./transformations')
const { formatSteps } = require('./formatters')
const config = require('../../config.json')

const fetchStatus = async params => {
  // This is so we can change the params while this function waits for the build to pass
  let { owner, repo, branch } = params

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
    await Promise.delay(config.circleCi.delay)
    return fetchStatus(params)
  }

  let { steps } = await api.specificBuild({ owner, repo, build: build_num })
  let failingSteps = filterFailing(steps)
  return `${config.header}\n${await formatSteps(failingSteps)}`
}

module.exports = {
  fetchStatus
}
