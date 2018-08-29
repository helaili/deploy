/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.log('Yay, the app was loaded!')
  
  const getConfig = require('probot-config')

  // Get an express router to expose new HTTP endpoints
  const router = app.route('/my-app')
  router.use(require('express').static('public'))

  router.get('/auth', (req, res) => {
    app.log('Auth with Get')
    res.end('Auth with Get')
  })

  router.post('/auth', (req, res) => {
    app.log('Auth with Post')
    res.end('Auth with Post')
  })

  app.on('pull_request.labeled', async context => {
    const config = await getConfig(context, 'probot-config.yml')

    let labelName = context.payload.label.name
    let encodedLabelName = encodeURI(labelName)

    if (config.labels[encodedLabelName]) {
      let deployment = config.labels[encodedLabelName]
      deployment.owner = context.payload.pull_request.head.repo.owner.login
      deployment.repo = context.payload.pull_request.head.repo.name
      deployment.ref = context.payload.pull_request.head.sha

      let deploymentResult = context.github.repos.createDeployment(deployment)

      let labelCleanup = {
        'owner': context.payload.pull_request.head.repo.owner.login,
        'repo': context.payload.pull_request.head.repo.name,
        'number': context.payload.pull_request.number,
        'name': labelName
      }
      context.github.issues.removeLabel(labelCleanup)

      return deploymentResult
    }
  })
}
