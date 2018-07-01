let circleci = require('../../../ci/circleci')

// check_suite circleCi
//
// This event handler is expected to be called when a CI build finishes,
// it updates the pull request body with a formatted summary of the status
// of the CircleCI build.
//
module.exports = async context => {
  const { owner, repo } = context.repo()
  const [{ number }] = context.payload.check_suite.pull_requests
  let {
    data: { body }
  } = await context.github.pullRequests.get({ owner, repo, number })
  let status = await circleci.getStatus()
  body = `${body}\n${status}`
  await context.github.pullRequests.update({ owner, repo, number, body })
}
