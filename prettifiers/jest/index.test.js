const jestPretty = require('./')
const { readFileSync } = require('fs')
const path = require('path')
const jestFixture = readFileSync(
  path.resolve(`${__dirname}/../../fixtures/jest_failed_output`),
  { encoding: 'utf8' }
)

describe('Jest Prettifier Utilities', () => {
  describe('validate', () => {
    it('Should validate jest output', async () => {
      expect(jestPretty.validate(jestFixture)).toBe(true)
    })
    it('Should invalidate something other than jest output', async () => {
      expect(jestPretty.validate('Something Other Than Jest Output')).toBe(
        false
      )
    })
  })
  describe('prettify', () => {
    it('Should prettify jest output', async () => {
      expect(jestPretty.prettify(jestFixture)).toBe(`FAIL
 ci/circleci/index.test.js
  ● CircleCI's main API › fetchStatus › Should fetch the latest build's status and format it properly
    - Expected
    + Received
    - - **test**'s \`np test\`:
    + - **test**'s \`npm test\`:
    > 34 |       expect(result).toBe(expectedResult)
  ● CircleCI's main API › fetchStatus › Should fail properly if the last builds are not found
    - Expected
    + Received
    - :robot:  This repoitory doesn't seem to be configured with CircleCI.
    + :robot:  This repository doesn't seem to be configured with CircleCI.
    > 74 |       expect(result).toBe(expectedResult)
FAIL
 events/check_suite/circleCi/index.test.js
  ● check_suite CircleCI › should update the PR's body › should work two times
    TypeError: Cannot read property '0' of undefined
    > 48 |       expect(github.pullRequests.update.mock.calls[1][0].body).toBe(body)`)
    })
  })
})
