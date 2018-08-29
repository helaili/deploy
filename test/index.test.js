const fs = require('fs')
const path = require('path')
const { Application } = require('probot')
const myProbotApp = require('..')

const deployLabelAppliedPayload = require('./fixtures/deploy-test_label.applied.json')
const nonDeployLabelAppliedPayload = require('./fixtures/bug_label.applied.json')
const configFile = './fixtures/probot-config.yml'

/*
 * Load the config file
 */
function readMockConfig (fileName) {
  let configData

  try {
    const filePath = path.resolve(__dirname, fileName)
    configData = fs.readFileSync(filePath, 'utf8')
  } catch (e) {
    console.log(e)
  }

  return configData
}

describe('My Probot app', () => {
  let app, github

  beforeEach(() => {
    app = new Application()
    // Initialize the app based on the code from index.js
    app.load(myProbotApp)

    let configData = Buffer.from(readMockConfig(configFile)).toString('base64')

    // This is an easy way to mock out the GitHub API
    github = {
      issues: {
        removeLabel: jest.fn().mockReturnValue(Promise.resolve({})),
        createComment: jest.fn().mockReturnValue(Promise.resolve({}))
      },
      repos: {
        createDeployment: jest.fn().mockReturnValue(Promise.resolve({})),
        getContent: jest.fn().mockReturnValue({
          data: {
            content: configData
          }
        })
      }
    }
    // Passes the mocked out GitHub API into out app instance
    app.auth = () => Promise.resolve(github)
  })

  test('creates a deployment when a deploy label is applied to a PR', async () => {
    // Simulates delivery of an issues.opened webhook
    await app.receive({
      event: 'pull_request.labeled',
      payload: deployLabelAppliedPayload
    })

    expect(github.repos.createDeployment).toHaveBeenCalled()
    expect(github.issues.removeLabel).toHaveBeenCalled()
  })

  test('do not create a deployment when a non deploy label is applied to a PR', async () => {
    // Simulates delivery of an issues.opened webhook
    await app.receive({
      event: 'pull_request.labeled',
      payload: nonDeployLabelAppliedPayload
    })

    expect(github.repos.createDeployment).not.toHaveBeenCalled()
    expect(github.issues.removeLabel).not.toHaveBeenCalled()
  })

  test('creates a comment when deployment fails', async () => {
    // Returning an error
    github.repos.createDeployment.mockImplementation(() => Promise.reject(new Error('{"message":"Conflict merging master into b4c150464b1236cc782cc590b391034f608056ec.","documentation_url":"https://developer.github.com/enterprise/2.14/v3/repos/deployments/#create-a-deployment"}')))

    // Simulates delivery of an issues.opened webhook
    await app.receive({
      event: 'pull_request.labeled',
      payload: deployLabelAppliedPayload
    })

    expect(github.repos.createDeployment).toHaveBeenCalled()
    expect(github.issues.removeLabel).toHaveBeenCalled()
    expect(github.issues.createComment).toHaveBeenCalled()
  })
})
