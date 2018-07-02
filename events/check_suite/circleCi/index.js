let circleci = require('../../../ci/circleci')
let { concatOnce } = require('../../../utils/strings')
let config = require('../../../config.json')

// check_suite circleCi
//
// This event handler is expected to be called when a CI build finishes,
// it updates the pull request body with a formatted summary of the status
// of the CircleCI build.
//
module.exports = async context => {
  const { owner, repo } = context.repo()
  const { head_branch } = context.payload.check_suite
  const [{ number }] = context.payload.check_suite.pull_requests
  let {
    data: { body }
  } = await context.github.pullRequests.get({ owner, repo, number })
  console.log('BODY', body)

  // TODO: Multi-CI-provider support
  let status = await circleci.fetchStatus({ owner, repo, branch: head_branch })

  body = concatOnce({
    input: body,
    start: config.status.start,
    end: config.status.end,
    body: status
  })

  await context.github.pullRequests.update({ owner, repo, number, body })
}
