const { getFailingTests, formatFail } = require('./utils')

// *VERY* naive Jest detector...
module.exports.validate = output => output.indexOf(' jest ') > -1

module.exports.prettify = output => {
  let failOutputs = getFailingTests(output)
  let formattedFails = failOutputs.map(formatFail).filter(x => x)
  return `FAIL${formattedFails.join('\nFAIL')}`
}
