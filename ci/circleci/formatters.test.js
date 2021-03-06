const formatters = require('./formatters')

let formattedFakeOutputUrl = `# out
FAKE OUTPUT_URL OUT MESSAGE
# err
FAKE OUTPUT_URL ERR MESSAGE`

describe('CircleCI Formatters', () => {
  describe('formatAction', () => {
    it('Should format an action properly', async () => {
      let action = {
        name: 'lint',
        type: 'test',
        status: 'failed',
        bash_command: 'npm run lint',
        start_time: '2018-07-01T05:33:58.571Z',
        run_time_millis: 1024
      }
      let formattedAction = formatters.formatAction(action)
      let expectedResult = `|${action.name}|${action.type}|${action.status}|\`${
        action.bash_command
      }\`|${action.start_time}|${action.run_time_millis} ms|`
      expect(formattedAction).toBe(expectedResult)
    })
  })

  describe('formatOutput', () => {
    it("Should fetch and format the actions' output_urls", async () => {
      let action = {
        name: 'lint',
        bash_command: 'npm run lint',
        output_url: 'http://fake.butts.output_url:1337/'
      }
      let formattedOutput = await formatters.formatOutput(action)
      let expectedResult = `- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\``
      expect(formattedOutput).toBe(expectedResult)
    })
    it("If the URL couldn't be fetched, it should show a reasonable message instead", async () => {
      let action = {
        name: 'lint',
        bash_command: 'npm run lint',
        output_url: 'http://fake.butts.wrong.output_url:1337/'
      }
      let formattedOutput = await formatters.formatOutput(action)
      let expectedResult = `- **lint**'s \`npm run lint\`:
\`\`\`
Couldn't fetch the output file.
\`\`\``
      expect(formattedOutput).toBe(expectedResult)
    })
    it("If the action doesn't have output_urls, it should return an empty string", async () => {
      let action = {
        name: 'lint',
        bash_command: 'npm run lint'
      }
      let formattedOutput = await formatters.formatOutput(action)
      expect(formattedOutput).toBe('')
    })
  })

  describe('formatSteps', () => {
    it('Should format an step properly', async () => {
      let action = {
        name: 'lint',
        type: 'test',
        status: 'failed',
        bash_command: 'npm run lint',
        start_time: '2018-07-01T05:33:58.571Z',
        run_time_millis: 1024,
        output_url: 'http://fake.butts.output_url:1337/'
      }
      let step = {
        name: 'lint',
        actions: [action]
      }
      let formattedStep = await formatters.formatSteps([step])
      let expectedResult = `
| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|

**Output:**
- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\`
`
      expect(formattedStep).toBe(expectedResult)
    })
    it('Should handle multiple steps', async () => {
      let action = {
        name: 'lint',
        type: 'test',
        status: 'failed',
        bash_command: 'npm run lint',
        start_time: '2018-07-01T05:33:58.571Z',
        run_time_millis: 1024,
        output_url: 'http://fake.butts.output_url:1337/'
      }
      let step = {
        name: 'lint',
        actions: [action, action]
      }
      let formattedStep = await formatters.formatSteps([step, step])
      let expectedResult = `
| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|

**Outputs:**
- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
${formattedFakeOutputUrl}
\`\`\`
`
      expect(formattedStep).toBe(expectedResult)
    })
  })

  it('Should handle a real output file', async () => {
    let action = {
      name: 'lint',
      type: 'test',
      status: 'failed',
      bash_command: 'npm run lint',
      start_time: '2018-07-01T05:33:58.571Z',
      run_time_millis: 1024,
      output_url: 'http://real.output_url:1337/'
    }
    let step = {
      name: 'lint',
      actions: [action]
    }
    let formattedStep = await formatters.formatSteps([step])
    let expectedResult = `
| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |
|lint|test|failed|\`npm run lint\`|2018-07-01T05:33:58.571Z|1024 ms|

**Output:**
- **lint**'s \`npm run lint\`:
\`\`\`
# out
FAIL
  events/check_suite/circleCi/index.test.js
  ● Checking CircleCI › your functionality › performs an action
    Cannot find module '../../config.json' from 'api.js'
    > 2 | const config = require('../../config.json')
# err
Exited with code 1
\`\`\`
`
    expect(formattedStep.replace(/\r/g, '')).toBe(expectedResult)
  })
})
