# probot-deploy

> A [Probot](https://github.com/probot/probot) app triggering deployments on GitHub


Commit a `.github/probot-config.yml` file in your repository

```
labels:
  Deploy%20To%20Staging:
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

You can use whichever environment parameter used by GitHub's deployment API

Create matching labels in your repository



## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Contributing

If you have suggestions for how probot-deploy could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Alain Hélaïli <helaili@github.com> (https://helaili.gitub.io/probot-deploy)
