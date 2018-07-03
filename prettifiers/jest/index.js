const { getFailingTests, formatFail } = require('./utils')

// *VERY* naive Jest detector...
module.exports.validate = output => output.indexOf(' jest ') > -1

// This prettifier splits and filters the failing tests out of
// the given data, then formats each one of them, then joins them
// altogether with the familiar `FAIL` message that Jest shows
// at the beginning of each step.
module.exports.prettify = data => {
  let failData = getFailingTests(data)
  let formattedFails = failData.map(formatFail).filter(x => x)
  return `FAIL${formattedFails.join('\nFAIL')}`
}
