# Goal

Make a Github Application that will:
- Report CI errors on pull requests as comments.
- Format the output of the problem.

# How to build your own

1. Create a github app: https://github.com/settings/apps/new

Github App Name: testGithubApp-sadasant
:3000/webhook
secret: XXXXXX

Read more about the secret: https://developer.github.com/webhooks/securing/

Copy the App ID to your .env

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

Links to check what's up with your app:
- ahttps://github.com/settings/apps/testgithubapp-sadasant
- https://github.com/settings/installations/228280

???? Where are the logs? I mean, where can I see good attempts &
failed attempts? Here: https://github.com/settings/apps/testgithubapp-sadasant/advanced

I was getting this error for a while:
https://github.com/probot/template/issues/8
I think it happened to me because I tried to remove the webhook secret
from the app, so I didn't have one locally, but perhaps github was
thinking the app had one??

This issue was useful to understand the error:
https://github.com/probot/friction/issues/16
