# How to build your own

1. Create a github app: https://github.com/settings/apps/new

Github App Name: testGithubApp-sadasant
:8080/authCallback
:8080/webhooks
secret: XXXXXX

Read more about the secret: https://developer.github.com/webhooks/securing/

Permissions:

Your app needs the following permissions:
- Checks (read and write). More info about checks here: https://developer.github.com/v3/checks/runs/
- Repository contents (read and write).
- Deployments ???? https://developer.github.com/v3/repos/deployments/
- Issues (read and write)
- Pull requests (read and write)

Subscribe to events:
- Check suite
- check run
- commit comment
- deployment ?????
- deployment status ?????
- pull request
- pull request review
- pull request review comment

After that, pick a cool avatar and generate a private key.
Scroll to the bottom and copy the Client ID and Client Secret to
`config.json`

Then, install your app on the repositories you might want.

Then npm install in this repo
