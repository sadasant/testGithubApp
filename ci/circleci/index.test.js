const circleci = require('./')
const config = require('../../config.json')

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
      let expectedResult = `${config.header}

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

    it('Should properly format a success status', async () => {
      let result = await circleci.fetchStatus({
        owner: 'sadasant',
        repo: 'testGithubApp',
        branch: 'feature/ci-passed'
      })
      let expectedResult = `\n${
        config.smallHeader
      } CircleCI Passed! :clap::white_check_mark:`
      expect(result).toBe(expectedResult)
    })

    it('Should wait until the build passes', async () => {
      let params = {
        owner: 'sadasant',
        repo: 'testGithubApp',
        branch: 'feature/ci-queued'
      }
      let result = circleci.fetchStatus(params)
      expect(result).toHaveProperty('then')
      params.branch = 'feature/ci-passed'
      result = await result
      let expectedResult = `\n${
        config.smallHeader
      } CircleCI Passed! :clap::white_check_mark:`
      expect(result).toBe(expectedResult)
    })

    it('Should fail properly if the last builds are not found', async () => {
      let result = await circleci.fetchStatus({
        owner: 'sadasant',
        repo: 'MISSINGREPO',
        branch: 'feature/fetchingCircleCIData'
      })
      let expectedResult = `\n${
        config.smallHeader
      } This repository doesn't seem to be configured with CircleCI.`
      expect(result).toBe(expectedResult)
    })
  })
})
