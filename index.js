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

  // Use any middleware
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
    context.log.debug(context.payload.label.name, 'Received label\'s name')

    if (config[context.payload.label.name]) {
      context.log.debug(config[context.payload.label.name], 'Environment found')
    }
    return 1
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
