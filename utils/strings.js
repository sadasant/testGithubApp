// concatOnce
// Receives:
//   { input: String, start: String, end: String, body: String }
// Returns: String
//
// Concat once will add the given body to the given input, wrapped with the provided
// start and end string. If the input already has this combination of start+body+end,
// then it removes the existing version and places the new version on the same place,
// preserving the input text that existed before and after the block.
//
module.exports.concatOnce = ({ input, start, end, body }) => {
  let matchTheOldBlock = new RegExp(`${start}(\n|.)*${end}`)
  let [before, , after = ''] = input.split(matchTheOldBlock)
  return `${before}${start}${body}${end}${after}`
}
