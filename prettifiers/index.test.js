const prettifiers = require('./')
const jestPretty = require('./jest')

describe('Prettifier Utilities', () => {
  describe('prettyPlease', () => {
    it("Should prettify Jest's output", async () => {
      jestPretty.validate = () => true
      jestPretty.prettify = () => 'Pretty!'
      let input = 'Some text'
      expect(await prettifiers.prettyPlease(input)).toBe('Pretty!')
    })

    it('Should leave the input as is if nothing matches', async () => {
      jestPretty.validate = () => false
      let input = 'Some text'
      expect(await prettifiers.prettyPlease(input)).toBe(input)
    })
  })
})
