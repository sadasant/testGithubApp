const api = require('./api')
const { filterFailing } = require('./transformations')

module.exports.fetchStatus = async ({ owner, repo, branch }) => {
  const { status, build_num } = await api.lastBuildOnBranch({
    owner,
    repo,
    branch
  })

  if (status === 'success') return `CircleCI Passed! :clap::white_check_mark:`

  const { steps } = await api.specificBuild({ owner, repo, build: build_num })
  const failingSteps = filterFailing(steps)
}
