# Awesome Concept for a Github App :robot::sparkles:

Welcome to this repo 🖖


<img align="left" height="150px" src="https://i0.wp.com/gifrific.com/wp-content/uploads/2017/05/terry-crews-dancing-robot.gif?ssl=1">
This project holds a boilerplate to build Github Apps, with some small functionalities that are both useful as well as just concepts for myself and others to play with. :bowtie: Join me in this journey to discover what else amazing can be done!
<br/><br/><br/><br/><br/>

## Index

- [Current features](#current-features)
- [Folder structure](#folder-structure)
- [Maybe future features](#maybe-future-features)
- [How to build](#how-to-build)
- [I want to use it right now!](#i-want-to-use-it-right-now)
- [Disclaimer](#disclaimer)
- [Resources](#resources)

## Current features

As a Github App, this repo adds a little (but useful!) layer of functionality over Github!

**The main user-oriented features are:**
- A live listener to Pull Request updates and CI events that will try hard to retrieve useful information from CI providers (currently only **CircleCI**).
- The information it obtains is added to the **description** of the open Pull Request **without affecting it**, you can later add information to it, either before or after the contents added by this robot and your information will never be removed (but the message by the robot might change as you make changes to your PR).
- It tells you when your CI build failed or passed! Here are some screenshots:

_(A failing PR)_  
<img height="450" src="https://i.imgur.com/1wP6o6K.png">

_(Later, when it passed)_  
<img height="225" src="https://i.imgur.com/DX69z2e.png">

Besides being useful for end users, I made this repo as a template for me (and possibly others) to work with any form or shape of Github App! Here's why I think this:

**The main features as a Github App boilerplate:**
- The folder structure is such that you can grow in size on your terms! We'll elaborate more on the following bullet points.
- The main index file automatically recognizes what events you want to subscribe to, based on the event folders you have in `events`. For example: Right now, we're subscribing to the `check_suite` and `pull_request` events. If you want to add listeners for other events, you would only need to add folders with the name of these events, with folders named to highlight the functionality of your listener. The index file will run all the different `<event>/<functionality>/index.js` you have!
- We have a `ci` folder aiming to contain all the functionalities needed to work with the different CI providers. We currently only work with CircleCI, but the functions in `ci/circleci` should show a decent approach for what is needed to work with any other CI.
- We have a function called `prettyPlease` in the `prettifiers` folder, that allows you to build file formatters by creating new folders in `prettifiers` with an `index.js` that exposes two functions: `validate` and `prettify`, where `validate` deals with checking wether the output should be prettified or not. These file formatters matter because the CI providers provide raw outputs of why each of their build steps failed, and this output can be too verbose for developers to identify where the problems are. Right now, we have only one prettifier that works with Jest, but it should work as the scaffoldings for building more. The idea with `prettyPlease` is that it will try to format a specific output, and return the original output as is if nothing matches.

![](https://i.imgur.com/o1ytFXV.png)

**Other neat features for developers:**
<img align="right" height="310" src="https://i.imgur.com/095rvzR.png">
- It's 100% unit tested! Including functions, API calls to remote endpoints, formattings and dispatching and handling Github Webhook events.
- We have a minimal layer of mocked utilities - right now I'm only mocking `request-promise` [here](https://github.com/sadasant/testGithubApp/blob/master/__mocks__/request-promise.js), which should prove that you can build entirely functional Github Apps with no connection to the internet! 😆
- We use `prettier` and `eslint` to automatically format the code of the repository (you still need to call `npm run fmt`). The idea is that we should reduce the number of possible dissagreements over code styles and formats and just let the tools handle that for us :) ... I realize that you might be familiar with that, so let's move to the next point!
- We have as minimal dependencies as possible!

## Maybe future features

Because this is a concept application, I'm not exploring all the ideas I have, but I still would like this to reach the point where it can do at least these two ideas:

1. Pull Request Review with in-line comments about why CI failed, if CI's output happens to show that any of the files changed by the PR are causing some step to fail. Here's an issue: https://github.com/sadasant/testGithubApp/issues/15
2. Optionally auto-format code in pull request. I believe that in the output we generate, we could add a link that would trigger us to fork the repo, run run `npm run fmt` and push teh changes to the PR! Here's an issue: https://github.com/sadasant/testGithubApp/issues/17

## How to build

Since this is more of a boilerplate for your own app, I'm including steps on how to set up your app!

1. Create a github app

- Go to: https://github.com/settings/apps/new
- Fill down the form.
- Keep in mind that the webhook endpoint will try to call the `/webhook` route.
- Add permissions to: Checks (read) and Pull requests (read and write).
- **Important**, if you add a secret, make sure you save it, because I was unsuccessful removing the secret! Read more about the secret: https://developer.github.com/webhooks/securing/
- **Important**, make sure you copy the `App ID` that is visible once you finish creating the application. You can always go back and see it, but it might not be obvious how to get there 😅Here's a link just in case: https://github.com/settings/apps
- Generate a Private Key and download it.
- After you finish creating it, install your app on the repositories you might want.

2. Install NodeJS

You'll need NodeJS. I like using nvm, since it gives you the freedom to move back and forward between one version and another. Just as they say in their README, you can install NVM with:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

Other tools like `npx` look cool! I haven't tried it though.

3. Fork this repo

- Just `git clone https://github.com/sadasant/testGithubApp` is enough :-)
- Copy the downloaded Private Key to the root of this repo!
- Once in the root of this repo, run `npm install`

4. Create your `.env` file

- Copy the `.env.example` file into a new file called `.env`.
- Paste the App ID in your `.env` file, as `APP_ID=XXXX`.
- Paste th Webhook Secret in your `.env` file too, as `WEBHOOK_SECRET=XXXX`.

5. Create your `config.json` file

- Copy the `public.config.json` to `config.json`.
- Get your CircleCI's personal API token following this guide: https://github.com/probot/probot-config
- Add a new property in the `circleCi` object called `apiToken`, paste your API token there, like this: `"apiToken": "XXXX"`. Make sure that your JSON file is valid!

## I want to use it right now!

I'm currently hosting this app in one of my servers, and it's running intermitently since I use these servers for other purposes. The APP is live for this repo, but it is unlisted :/ I'm hesitant to list it with so little features. I also dislike the name 🤔

Right now you can run `npm test` to run the unit tests 🙈✅

## Disclaimer

<img align="right" height="150px" src="https://pbs.twimg.com/profile_images/632821853627678720/zPKK7jql_400x400.png">

> First, the logo I picked for the app is a reference to Steve McConnell's Code Complete 2, but also a reference to the (perhaps more popular) Jeff Atwood :) Instead of elaborating, I'm going to provide links to his contents:
>
> - https://twitter.com/codinghorror
> - https://blog.codinghorror.com/
> - And, [the book from Steve McConnel](https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670/ref=sr_1_1).

I personally believe that this project is a decent blueprint for other Github Apps, and as a tool it offers a decent amount of functionality. However, considering this is my first Github App ever, I'm sure with more experience working on them, some of the design decisions might change.

Here's some self criticism:
- I should have cleaned up the `fixtures`, or not include them in the tree, since they contan information that might not be relevant for the public.
- The `ci/circleci` tools, and the `prettifiers/jest/utils.js` utiity functions, contain a fair bit of text manipulation that can easily break if an unexpected input appears. This can be improved with some pattern matching utility.

Things that I've found difficult:
- I lost some time trying to figure which path is used by default a
  the end of the Webhook URL. Now I know that there's no path (it uses
  the root by default), but since I started using smee.io first, then
  moved it to my own remote server, it wasn't clear how smee.io would
  route the requests to my server, so I needed to figure out the
  Webhook path. By browsing Probot's source code, I found that the
  default value for this setting is `/` 👍
- I also lost some time because I was getting `message":"Not
  Found","documentation_url"` kind of errors. Turns out that my
  webhook secret key was incorrect! But here's the issue: I had
  created the app with a webhook secret, then I edited it and removed
  the webhook secret, so I thought I had none! After setting the
  webhook secret again both in the Github App's settings and in my
  `.env` file, my Probot started working!

Things that I think I could have done better:
- I know I could have used the `.env` file for all my configurations, and I also know that [probot-config](https://github.com/probot/probot-config) exists (I even have it in the package.json). Leveraging that file and that tool probably worths it, but I haven't checked.

## Resources

Links to check what's up with your app:
- ahttps://github.com/settings/apps/testgithubapp-sadasant
- https://github.com/settings/installations/228280

These two pages in the docs are incredibly powerful:
- https://probot.github.io/docs/simulating-webhooks/
- https://probot.github.io/docs/testing/
