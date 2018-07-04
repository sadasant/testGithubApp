const zlib = require('zlib')
const util = require('util')
const gzip = util.promisify(zlib.gzip)
const { readFileSync } = require('fs')
const path = require('path')

const responses = {
  'http://real.output_url:1337/': readFileSync(
    path.resolve(
      `${__dirname}/../fixtures/circleci_failed_step_action_output_url.gz`
    )
  ),
  'http://fake.butts.output_url:1337/': gzip(
    JSON.stringify([
      {
        message: 'FAKE OUTPUT_URL OUT MESSAGE',
        type: 'out'
      },
      {
        message: 'FAKE OUTPUT_URL ERR MESSAGE',
        type: 'err'
      }
    ])
  ),

  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/firstListeners': require('../fixtures/circleci_get_user_repo_tree_branch.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/fetchingCircleCIData': require('../fixtures/circleci_get_user_repo_tree_branch_failed.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/MISSINGREPO/tree/feature/fetchingCircleCIData': {
    message: 'Some Error Message'
  },
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/ci-queued': require('../fixtures/circleci_get_user_repo_tree_branch_queued.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/ci-passed': require('../fixtures/circleci_get_user_repo_tree_branch.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/tree/feature/ci-unrecognized': require('../fixtures/circleci_get_user_repo_tree_branch_unrecognized.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/18': require('../fixtures/circleci_get_user_repo_buildnum_failed.json'),
  'https://circleci.com/api/v1.1/project/github/sadasant/testGithubApp/29': require('../fixtures/circleci_get_user_repo_buildnum_unrecognized.json')
}

module.exports = async params =>
  console.info('Mocked request-promise:', params.uri || params) ||
  responses[params.uri || params]
