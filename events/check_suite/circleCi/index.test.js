const { Application } = require('probot')
const plugin = require('../../../index')
const payload = require('../../../fixtures/pr_check_suite')

describe('Checking CircleCI', () => {
  let app
  let github
  let body = 'Pull Request Body'
  let pullRequests = payload.check_suite.pull_requests

  beforeEach(() => {
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

  describe('your functionality', () => {
    it('performs an action', async () => {
      await app.receive({ event: 'check_suite', payload })
      expect(github.pullRequests.update).toHaveBeenCalled()
      expect(
        github.pullRequests.update.mock.calls[0][0].body.indexOf(body)
      ).toBe(0)
      expect(github.pullRequests.update.mock.calls[0][0].body).not.toBe(body)
    })
  })
})
