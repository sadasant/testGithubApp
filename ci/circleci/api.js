const request = require('request-promise')
const config = require('../../config.json')

const circleAPI = 'https://circleci.com/api/v1.1/project/github'
const circleAPICall = async ({ path, method = 'GET' }) =>
  request({
    method,
    uri: `${circleAPI}/${path}`,
    qs: {
      'circle-token': config.circleCi.apiToken
    },
    json: true
  })

module.export.lastBuildOnBranch = async ({ owner, repo, branch }) =>
  circleAPICall({
    path: `${owner}/${repo}/tree/${branch}`
  })

module.export.specificBuild = async ({ owner, repo, build }) =>
  circleAPICall({
    path: `${owner}/${repo}/${build}`
  })
