const responses = {
  'http://fake.butts.url:1337/': 'FAKE RESPONSE',
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/firstListeners': require('../fixtures/circleci_get_user_repo_tree_branch.json')
}

module.exports = async params => responses[params.uri || params]
