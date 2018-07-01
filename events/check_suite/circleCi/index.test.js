const { Application } = require('probot')
const plugin = require('../../../index')
const payload = require('../../../fixtures/pr_check_suite')

describe('Checking CircleCI', () => {
  let app
  let github
  let body = 'Pull Request Body'

  beforeEach(() => {
    app = new Application()
    app.load(plugin)
    // This is an easy way to mock out the GitHub API
    github = {
      pullRequests: {
        async get() {
          return {
            body
          }
        },
        update: jest.fn().mockReturnValue(
          Promise.resolve({
            // Whatever the GitHub API should return
          })
        )
      }
    }
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)
  })

  describe('your functionality', () => {
    it('performs an action', async () => {
      await app.receive({ event: 'check_suite', payload })
      expect(github.pullRequests.update).toHaveBeenCalled()
      expect(github.pullRequests.update.mock.calls[0][0].body).not.toBe(body)
    })
  })
})
