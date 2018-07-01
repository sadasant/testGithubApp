let circleci = require('../../../ci/circleci')

// check_suite circleCi
module.exports = async context => {
  const { owner, repo } = context.repo()
  const [number] = context.payload.check_suite.pull_requests
  let { body } = await context.github.pullRequests.get({ owner, repo, number })
  let status = await circleci.getStatus()
  body = `${body}\n${status}`
  await context.github.pullRequests.update({ owner, repo, number, body })
}
