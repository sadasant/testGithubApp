const prettifiers = [
  require('./jest')
  // TODO: Do the readdirSync thing we do in other places.
  // TODO: Mocha & others.
]

// prettyPlease
//
// It will loop over the available prettifiers,
// calling the first one that validates, and returning
// the prittified output.
//
// I thought on calling this maybePretty
// or something related to formatting,
// but prettyPlease is funny and I need to make
// jokes with somebody T_T
//
// There's something about the large number of
// double ts that just makes it for me :D
//
const prettyPlease = async input => {
  for (let prettifier of prettifiers) {
    if (await prettifier.validate(input)) {
      return prettifier.prettify(input)
    }
  }
  return input
}

module.exports = {
  prettyPlease
}
