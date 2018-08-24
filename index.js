/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

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
    const issueComment = context.issue({ body: 'Thanks for this label!' })
    return context.github.pullRequests.createComment(issueComment)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
