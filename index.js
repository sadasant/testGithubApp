let events = [
  'check_run',
  'check_suite',
  'commit_comment',
  'deployment',
  'deployment_status',
  'pull_request',
  'pull_request_review',
  'pull_request_review_comment',
]
module.exports = app => {
  for (let e of events) {
    app.on(e, async context => {
      app.log(e, context)
    })
  }
}
