const { getEvents } = require('./utils/alias')

// Here we initialize a PRobot that will listen to all the event
// functions that we have declared in the events folder.
module.exports = app =>
  getEvents().map(
    ({ event, name, path }) =>
      app.log(`Activating ${event}/${name} ✓`) ||
      app.on(
        event,
        async context =>
          app.log(`Running ${event}/${name} ↣`) || require(path)(context)
      )
  )
