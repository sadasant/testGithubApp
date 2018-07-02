const circleci = require('./')

describe("CircleCI's main API", () => {
  describe('fetchStatus', () => {
    it("Should fetch the latest build's status and format it properly", async () => {
      let result = await circleci.fetchStatus({
        owner: 'sadasant',
        repo: 'testGithubApp',
        branch: 'feature/fetchingCircleCIData'
      })
      let action = {
        name: 'test',
        type: 'test',
        status: 'failed',
        bash_command: 'npm test',
        start_time: '2018-07-02T04:16:57.164Z',
        run_time_millis: 5715
      }
      let expectedResult = `
PR ROBOT :robot:
---


| Name | Type | Status | Bash Command | Start Time | Duration |
| ---  | ---  | ---    | ---          | ---        | ---      |
|${action.name}|${action.type}|${action.status}|\`${action.bash_command}\`|${
        action.start_time
      }|${action.run_time_millis} ms|

**Output:**
- **test**'s \`npm test\`:
\`\`\`
Couldn't fetch the output file.
\`\`\`
`
      expect(result).toBe(expectedResult)
    })
  })
})
