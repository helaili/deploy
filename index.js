/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  // Your code here
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
    context.log.debug(config, 'Loaded config')
    context.log.debug('Received label\'s name:', context.payload.label.name)

    let encodedLabelName = encodeURI(context.payload.label.name)
    context.log.debug('Encoded label\'s name:', encodedLabelName)

    if (config.labels[encodedLabelName]) {
      context.log.debug(config.labels[encodedLabelName], 'Label config found')

      let deployment = config.labels[encodedLabelName]
      deployment.owner = context.payload.pull_request.head.repo.owner.login
      deployment.repo = context.payload.pull_request.head.repo.name
      deployment.ref = context.payload.pull_request.head.sha

      context.log.debug(deployment, 'Deployment request')

      let deploymentResult = context.github.repos.createDeployment(deployment)

      context.log.debug(deploymentResult, 'Deployment response')
    }
    return 1
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
