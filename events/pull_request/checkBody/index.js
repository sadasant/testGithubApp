let circleci = require('../../../ci/circleci')
let { concatOnce } = require('../../../utils/strings')
let config = require('../../../config.json')

// pull_request checkBody
//
// This event handler is expected to be called when somebody changes the PR body.
// it updates the pull request body with a formatted summary of the status
// of the CircleCI build.
//
module.exports = async context => {
  const { owner, repo } = context.repo()
  const head_branch = context.payload.pull_request.head.ref
  const { number, body } = context.payload.pull_request

  // TODO: Multi-provider support
  let status = await circleci.fetchStatus({ owner, repo, branch: head_branch })

  let newBody = concatOnce({
    input: body,
    start: config.status.start,
    end: config.status.end,
    body: status
  })

  if (body !== newBody)
    await context.github.pullRequests.update({ owner, repo, number, body: newBody })
}
