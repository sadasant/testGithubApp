const formatters = require('./formatters')

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
        output_url: 'http://fake.butts.url:1337/'
      }
      let formattedOutput = await formatters.formatOutput(action)
      let expectedResult = `- **lint**'s \`npm run lint\`:
\`\`\`
FAKE RESPONSE
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
        output_url: 'http://fake.butts.url:1337/'
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
FAKE RESPONSE
\`\`\``
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
        output_url: 'http://fake.butts.url:1337/'
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
FAKE RESPONSE
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
FAKE RESPONSE
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
FAKE RESPONSE
\`\`\`
- **lint**'s \`npm run lint\`:
\`\`\`
FAKE RESPONSE
\`\`\``
      expect(formattedStep).toBe(expectedResult)
    })
  })
})
