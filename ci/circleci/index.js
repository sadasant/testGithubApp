let { concatOnce } = require('../../utils/strings')
let config = require('../../config.json')

module.exports.fetchStatus = () => 'NOT SUPPORTED'

module.exports.addStatusTo = (input, status) =>
  concatOnce({
    input,
    start: config.status.start,
    end: config.status.end,
    body: status
  })
