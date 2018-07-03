const request = require('request-promise')
const config = require('../../config.json')

const circleAPI = 'https://circleci.com/api/v1.1/project/github'

// circleAPICall, just a higher order function on top of
// request-promise.
//
// Receives an object with two properties,
//   { path: String, method: String }
//
// Returns a promise that will result in the response from calling the given
// path with the given method. The request will include the CircleCI API token
// as a query parameter. The response will be a JavaScript Plain Object.
//
const circleAPICall = async ({ path, method = 'GET' }) =>
  request({
    method,
    uri: `${circleAPI}/${path}`,
    qs: {
      'circle-token': config.circleCi.apiToken
    },
    json: true
  })

// lastBuilds will asynchronously call the CircleCI API to retrieve
// an array with the latest builds for the given owner/repo/banch
module.exports.lastBuilds = async ({ owner, repo, branch }) =>
  circleAPICall({
    path: `${owner}/${repo}/tree/${branch}`
  })

// specificBuild will asynchronously call the CircleCI API to retrieve
// the given owner/repo/build
module.exports.specificBuild = async ({ owner, repo, build }) =>
  circleAPICall({
    path: `${owner}/${repo}/${build}`
  })
