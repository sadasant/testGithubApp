// check_suite circleCi
module.exports = async context => {
  const { owner, repo } = context.repo()
  const [number] = context.payload.check_suite.pull_requests
  let body = 'Hello!'
  await context.github.pullRequests.createComment({ owner, repo, number, body })
}
