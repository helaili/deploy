# probot-deploy [![Build Status](https://travis-ci.org/helaili/probot-deploy.svg?branch=master)](https://travis-ci.org/helaili/probot-deploy)

A [Probot](https://github.com/probot/probot) app triggering deployment events on GitHub based on pull request labels.


- Commit a `.github/probot-config.yml` file in your repository with the description of your environments. Spaces must be escaped. You can use whichever [environment parameter](https://developer.github.com/v3/repos/deployments/#parameters) used by GitHub's deployment API


```
labels:
  Deploy%20to%20Staging:
    environment: staging
  deploy-to-test:
    environment: test
    description: A test environment based on Docker
    transient_environment: true
    auto_merge: false
    payload:
      port: 8080
      https: true
```

- Create matching labels in your repository

![image](https://user-images.githubusercontent.com/2787414/44651597-1dab3100-a9ea-11e8-842d-939553d05df0.png)

- Now just add one of this labels to your PR. The label will automatically be removed once the deployment has been requested.

![image](https://user-images.githubusercontent.com/2787414/44652769-15a0c080-a9ed-11e8-97bf-70cec7ee56cb.png)

## Contributing

If you have suggestions for how probot-deploy could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Alain Hélaïli <helaili@github.com> (https://helaili.gitub.io/probot-deploy)
