// Reducer: isOrWasFail
// Returns true if either the current value is 'FAIL'
// or the previous value (last element of the accumulator) was 'FAIL'
// ... I don't like the name, but I'm out of ideas.
//
const isOrWasFail = (accumulator, value) =>
  value === 'FAIL' || accumulator[accumulator.length - 1] === 'FAIL'

// Finds the lines that start with PASS or FAIL
// uses them to split the whole output,
// then only grabs the pieces that immediatly follow a `FAIL`
// element.
//
const getFailingTests = output =>
  [[]]
    .concat(output.split(/\n.*(PASS|FAIL)/))
    .reduce((a, b) => (isOrWasFail(a, b) ? a.concat(b) : a))
    .filter(x => x !== 'FAIL')

// A good part...
// Doesn't start with `Console\n`
// Contains at least one of: `Difference:`, `- Expected` and `- Received`
// Or contains `Error:`, as in `TypeError:`
// Or contains `Cannot find module`
const isGoodPart = part =>
  part.indexOf('Console\n') === -1 &&
  (part.indexOf('Difference:') > -1 ||
    part.indexOf('- Expected') > -1 ||
    part.indexOf('- Received') > -1 ||
    part.indexOf('Error:') > -1 ||
    part.indexOf('Cannot find module') > -1)

// A good line if...
// Starts with 4 spaces and either `+`, `-`, `>` or `at`.
const isGoodLine = line =>
  line.match(/^\s{4}([+->]|at) /) ||
  line.match(/error/i) ||
  line.match(/Cannot find module/)

// Tries to get the second half after splitting with `Difference:`,
// if there's no second part, just returns everything it received.
// If there's a second part, then it just filters each line with isGoodLine.
// The output should be like:
//   describe() title > inner describe() title > it() title
//   - Expected
//   + Received
//   - some expected value
//   + some received value
//   > 42 |  expect(expectedValue).toBe(receivedValue)
//     at Object.it (path/to/file.test.js)
//
const formatGoodPart = part => {
  let firstLine = part.split('\n')[0]
  let subparts = part.split('Difference:')
  let goodHalf = subparts[0]
  if (subparts.length > 1) {
    goodHalf = subparts[1]
  }
  let lines = goodHalf.split('\n')
  return `${firstLine}\n${lines.filter(isGoodLine).join('\n')}`
}

const formatFail = output => {
  let separator = '\n  ● '
  let parts = output.split(separator)
  let goodParts = parts.filter(isGoodPart).map(formatGoodPart)
  return goodParts.length
    ? `\n${parts[0]}${separator}${goodParts.join(separator)}`
    : ''
}

module.exports = {
  getFailingTests,
  formatFail
}
