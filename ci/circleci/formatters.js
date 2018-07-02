const Promise = require('bluebird')
const request = require('request-promise')

const actionsHeader = `
| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |`

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
    `\`${bash_command}\``,
    start_time,
    `${run_time_millis} ms`,
    '' // Just so it adds a | at the end
  ].join('|')

// Receives a CircleCI's step action, fetches the output_url.
// The output will be wrapped in a string with the following shape:
//   - **name**'s `bash_command`:
//   ```
//   output
//   ```
// If there's no output_url, returns an empty string.
//
const formatOutput = async ({ name, bash_command, output_url }) =>
  output_url
    ? `- **${name}**'s \`${bash_command}\`:
\`\`\`
${await request(output_url)}
\`\`\``
    : ''

// Receives a CircleCI's ste, then formats it and every one of it's actions,
// it also fetches the action's output.
// The step ends up with the format:
//   | Name | Type | Status | Bash Command | Start Time | Duration |
//   | ---  | ---  | ---    | ---          | ---        | ---      |
//   | name | type | status | `bash_command` | start_time | run_time_millis ms |
//   | name | type | status | `bash_command` | start_time | run_time_millis ms |
//   Outputs:
//   - **name**'s `bash_command`:
//   ```
//   output
//   ```
//   - **name**'s `bash_command`:
//   ```
//   output
//   ```
//
const formatSteps = async steps =>
  [
    actionsHeader,
    ...steps.map(step => step.actions.map(formatAction).join('\n')),
    `**Output${steps.length > 1 ? 's' : ''}:**`,
    ...(await Promise.all(
      steps.map(async step =>
        (await Promise.all(step.actions.map(formatOutput))).join('\n')
      )
    ))
  ].join('\n')

// I really want imports and exports :(
// Should I give it away and make this babel? or TS?
// But that takes time...
module.exports = {
  formatAction,
  formatOutput,
  formatSteps
}
