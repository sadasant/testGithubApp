module.exports.filterFailing = steps =>
  steps
    // Making sure we only return steps that have failing actions
    .filter(x => x.actions.find(y => y.failed))
    // Making sure we don't include successful actions
    .map(step => {
      step.actions = step.actions.filter(x => x.failed)
      return step
    })
