 let events = [
  'check_run',
  'check_suite',
  'commit_comment',
  'deployment',
  'deployment_status',
  'pull_request',
  'pull_request_review',
  'pull_request_review_comment',
  'check.run',
  'check.suite',
  'commit.comment',
  'deployment',
  'deployment.status',
  'pull.request',
  'pull.request.comment',
  'pull.request.review',
  'pull.request.review.comment',
  'issues.opened',
]
module.exports = app => {
  console.log('STARTING')
  for (let e of events) {
    console.log({ e })
    app.on(e, async context => {
      app.log(e, context)
    })
  }
}
