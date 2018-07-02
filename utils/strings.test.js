const strings = require('./strings')
const config = require('../config.json')

describe('String Utils', () => {
  describe('concatOnce', () => {
    console.info(`concatOnce
should should only concat a multi-line string once,
even if it's called again with it's own output`)

    let { start, end } = config.status
    let body = `PRobot comment!`

    it('Should work on strings that have nothing after the body of the concatenation', async () => {
      let input = `
      This string has multiple lines
      Here we have the second line
      This could go as many times
      as we want, it's probably fine
      `
      let result = strings.concatOnce({ input, start, end, body })
      expect(result).toBe(`${input}${start}${body}${end}`)
      result = strings.concatOnce({ input: result, start, end, body })
      expect(result).toBe(`${input}${start}${body}${end}`)
    })

    it('Should work on strings that have content under the concatenation body', async () => {
      let input = `
      This string has multiple lines
      Here we have the second line
      This could go as many times
      as we want, it's probably fine
      ${start}${body}${end}
      I'm blue, da ba dee da ba daa 
      Da ba dee da ba daa
      da ba dee da ba da
      ada ba dee da ba daa
      `
      let result = strings.concatOnce({ input, start, end, body })
      expect(result).toBe(input)
    })
  })
})
