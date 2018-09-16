# deploy [![Build Status](https://travis-ci.org/helaili/deploy.svg?branch=master)](https://travis-ci.org/helaili/deploy)

A [Probot](https://github.com/probot/probot) app triggering deployment events on GitHub based on pull request labels.

![probt-deploy-640](https://user-images.githubusercontent.com/2787414/44789192-3f4c1a00-ab9c-11e8-9093-353dfbe1bc1e.gif)

:warning: This app doesn't deploy anything. :warning:  It just triggers a deployment request which will be forwarded to any webhook listening to the deploy event on your repo or on your organization. Check GitHub's [deployment API](https://developer.github.com/v3/repos/deployments/) for more information.

## Setup

- Install the app from [its public page](https://github.com/apps/deploy)

- Commit a `.github/deploy.yml` file in your repository with the description of your environments. Spaces must be escaped. You can use whichever [environment parameter](https://developer.github.com/v3/repos/deployments/#parameters) used by GitHub's deployment API


```
labels:
  Deploy%20to%20Staging:
    environment: staging
  deploy-to-test:
    environment: test
    description: A test environment based on Docker
    transient_environment: true
    auto_merge: false
    required_contexts:
      - continuous-integration/travis-ci/push
    payload:
      port: 8080
      https: true
```

- Create matching labels in your repository

![image](https://user-images.githubusercontent.com/2787414/44651597-1dab3100-a9ea-11e8-842d-939553d05df0.png)

- Now just add one of these labels to your PR. The label will automatically be removed once the deployment has been requested.

![image](https://user-images.githubusercontent.com/2787414/44785547-91d40900-ab91-11e8-8d24-4a5fa10989e5.png)


## FAQ

In case you haven't waited for your Continuous Integration or other integrations to complete, or if one of them has failed and should be considered optional, you will get the comment below. You then have to modify your label description and include a `required_contexts` section which will list those contexts which are required. All others will be optional.

![image](https://user-images.githubusercontent.com/2787414/44785471-4cafd700-ab91-11e8-9b91-d95dec43cef3.png)

If your branch is conflicting with master, your deployment will fail (see below). If you do want to deploy a conflicting branch, then set `auto_merge` to `false` in your label configuration.

![image](https://user-images.githubusercontent.com/2787414/44785703-22aae480-ab92-11e8-95f3-617455932a41.png)

This app works for both github.com and GitHub Enterprise. In the later case, you will need to run your own instance of this app as described in [the Pobot documentation](https://probot.github.io/docs/deployment/). Do not forgot to set the `GHE_HOST` environment variable as described [here](https://probot.github.io/docs/github-api/#github-enterprise).

## Contributing

If you have suggestions for how *deploy* could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](#LICENSE) © 2018 Alain Hélaïli <helaili@github.com> (https://github.com/helaili/deploy)
