const { readdirSync } = require('fs')
const path = require('path')

// Alias functions,
// just easy names for non generic stuff

let eventsPath = path.resolve(`${__dirname}/../events`)

// getEvents is a synchronous function that loops through the events folder and
// retrieves all the sub folders, then formats these folder names into an array
// of elements with the following shape:
//   {
//     event: String, // the event's name
//     name: String,  // the subfolder's name
//     path: String,  // the full path to the subfolder
//   }
module.exports.getEvents = () => {
  let events = []
  readdirSync(eventsPath).map(event =>
    readdirSync(`${eventsPath}/${event}`).map(name =>
      events.push({
        event,
        name,
        path: `${eventsPath}/${event}/${name}`
      })
    )
  )
  return events
}
