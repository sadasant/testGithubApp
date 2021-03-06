const Promise = require('bluebird')
const request = require('request-promise')
const zlib = require('zlib')
const util = require('util')
const gunzip = util.promisify(zlib.gunzip)
const stripAnsi = require('strip-ansi')
const { prettyPlease } = require('../../prettifiers')

// Note: This might be useful as a separate setting in config.json,
// or perhaps in a folder with "templates". I'm wondering if it would
// make sense to use JSX for large Github Apps, since Github accepts
// HTML in their Markdown.
const actionsHeader = `
| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |`

// CircleCI seems to add `#!/bin/bash -eo pipefail` as a separate line
// before each one of the commands. Let's just remove that.
let cleanCommand = x => x.replace(/^#!\/bin\/bash.*\n/, '')

// Receives a CircleCI's step action, returns a string.
// Wraps the action's details in the following shape:
//   | name | type | status | `bash_command` | start_time | run_time_millis ms |
//
const formatAction = ({
  name,
  type,
  status,
  bash_command,
  start_time,
  run_time_millis
}) =>
  [
    '', // Just so it adds a | at the beginning
    name,
    type,
    status,
    `\`${cleanCommand(bash_command)}\``,
    start_time,
    `${run_time_millis} ms`,
    '' // Just so it adds a | at the end
  ].join('|')

// Receives a CircleCI's step action, fetches the output_url.
// The output will be wrapped in a string with the following shape:
//   - **name**'s `bash_command`:
//   ```
//   prettified non ansi output
//   ```
// If there's no output_url, returns an empty string.
// If we are able to fetch and decode an output file,
// we remove the Ansi characters, then we try to make it perettier
// with our prettyPlease utility.
//
const formatOutput = async ({ name, bash_command, output_url }) => {
  if (!output_url) return ''
  let result = "Couldn't fetch the output file."
  try {
    let rawResult = await request({
      uri: output_url,
      encoding: null
    })
    let jsonResult = (await gunzip(rawResult)).toString('utf8')
    let arrayResult = JSON.parse(jsonResult)
    let formattedParts = []
    for (let part of arrayResult) {
      let { message, type } = part
      formattedParts.push(`# ${type}
${await prettyPlease(stripAnsi(message))}`)
    }
    result = formattedParts.join('\n')
  } catch (e) {
    console.info("Couldn't download and inflate", output_url, e)
  }
  return `- **${name}**'s \`${cleanCommand(bash_command)}\`:
\`\`\`
${result}
\`\`\``
}

// formatSteps uses most of the functions above, in the sense that it
// receives a CircleCI's ste, then formats it and every one of it's actions,
// it also fetches the action's output.
// The step ends up with the format:
//   | Name | Type | Status | Bash Command | Start Time | Duration |
//   | ---  | ---  | ---    | ---          | ---        | ---      |
//   | name | type | status | `bash_command` | start_time | run_time_millis ms |
//   | name | type | status | `bash_command` | start_time | run_time_millis ms |
//   Outputs:
//   - **name**'s `bash_command`:
//   ```
//   prettified no ansi output
//   ```
//   - **name**'s `bash_command`:
//   ```
//   prettified no ansi output
//   ```
//
const formatSteps = async steps =>
  [
    actionsHeader,
    ...steps.map(step => step.actions.map(formatAction).join('\n')),
    '', // New line
    `**Output${steps.length > 1 ? 's' : ''}:**`,
    ...(await Promise.all(
      steps.map(async step =>
        (await Promise.all(step.actions.map(formatOutput))).join('\n')
      )
    )),
    '' // New line
  ].join('\n')

// I really want imports and exports :(
// Should I give it away and make this babel? or TS?
module.exports = {
  formatAction,
  formatOutput,
  formatSteps
}
