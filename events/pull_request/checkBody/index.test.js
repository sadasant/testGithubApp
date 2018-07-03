const { Application } = require('probot')
const plugin = require('../../../index')
const payload = require('../../../fixtures/pr_pull_request')

describe('pull_request checkBody', () => {
  let app
  let github
  let body

  beforeEach(() => {
    body = 'Pull Request Body'
    app = new Application()
    app.load(plugin)
    // This is an easy way to mock out the GitHub API
    github = {
      pullRequests: {
        update: jest.fn().mockReturnValue(Promise.resolve({}))
      }
    }
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)
  })

  describe("should update the PR's body", () => {
    it('should not call update two times', async () => {
      // First call
      await app.receive({ event: 'pull_request', payload })
      expect(github.pullRequests.update).toHaveBeenCalled()
      expect(
        github.pullRequests.update.mock.calls[0][0].body.indexOf(body)
      ).toBe(0)

      // Second call
      payload.pull_request.body = github.pullRequests.update.mock.calls[0][0].body
      github.pullRequests.update.mockClear()
      await app.receive({ event: 'pull_request', payload })
      expect(github.pullRequests.update).not.toHaveBeenCalled()
    })
  })
})
