const transformations = require('./transformations')

describe('CircleCI Transformations', () => {
  describe('filterFailing', () => {
    it('Should only keep events that have failing actions', async () => {
      let steps = [
        {
          name: 'EVENT 1',
          actions: [
            {
              failed: false
            }
          ]
        },
        {
          name: 'EVENT 2',
          actions: [
            {
              failed: true
            }
          ]
        }
      ]
      let filteredSteps = transformations.filterFailing(steps)
      expect(filteredSteps.length).toBe(1)
      expect(filteredSteps[0].name).toBe('EVENT 2')
    })
  })
})
