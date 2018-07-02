const { Application } = require('probot')
const plugin = require('../../../index')
const payload = require('../../../fixtures/pr_check_suite')

describe('Checking CircleCI', () => {
  let app
  let github
  let body
  let pullRequests = payload.check_suite.pull_requests

  beforeEach(() => {
    body = 'Pull Request Body'
    app = new Application()
    app.load(plugin)
    // This is an easy way to mock out the GitHub API
    github = {
      pullRequests: {
        async get({ number }) {
          let foundPR = pullRequests.find(x => x.number === number)
          if (!foundPR) throw 'Invalid PR Number'
          return {
            data: {
              ...foundPR,
              body
            }
          }
        },
        update: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)
  })

  describe("should update the PR's body", () => {
    it('should work one time', async () => {
      await app.receive({ event: 'check_suite', payload })
      expect(github.pullRequests.update).toHaveBeenCalled()
      expect(
        github.pullRequests.update.mock.calls[0][0].body.indexOf(body)
      ).toBe(0)
      expect(github.pullRequests.update.mock.calls[0][0].body).toBe(`Pull Request Body<span data="probot-comment-start"></span>
PR ROBOT :robot:
---

CircleCI Passed! :clap::white_check_mark:<span data="probot-comment-end"></span>`)
    })
    it('should work two times', async () => {
      await app.receive({ event: 'check_suite', payload })
      body = github.pullRequests.update.mock.calls[0][0].body
      await app.receive({ event: 'check_suite', payload })
      expect(github.pullRequests.update).toHaveBeenCalled()
      expect(
        github.pullRequests.update.mock.calls[1][0].body.indexOf(body)
      ).toBe(0)
      expect(github.pullRequests.update.mock.calls[1][0].body).toBe(`Pull Request Body<span data="probot-comment-start"></span>
PR ROBOT :robot:

 MAKING THE TESTS FAIL JUST TO TRY SOMETHING
 MAKING THE TESTS FAIL JUST TO TRY SOMETHING

---

CircleCI Passed! :clap::white_check_mark:<span data="probot-comment-end"></span>`)
    })
  })
})
