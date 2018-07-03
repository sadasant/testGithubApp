# Awesome Concept for a Github App :robot::sparkles:

Welcome to this repo 🖖

This project holds a boilerplate to build Github Apps, with some small functionalities that are both useful as well as just concepts for myself and others to play with. :bowtie: Join me in this journey to discover what else amazing can be done!

## Index

- [Current Features](#current-features)
- [Maybe Future Features](#maybe-future-features)
- [How to build](#how-to-build)
- [My reasoning while building this](#my-reasoning-while-building-this)
  - [Design Decisions](#design-decisions)
  - [Disclaimer](#disclaimer)
  - [Now What](#now-what)
- [Resources](#resources)

## Current Features

As a Github App, this repo adds a little (but useful!) layer of functionality over Github!

**The main user-oriented features are:**
- A live listener to Pull Request updates and CI events that will try hard to retrieve useful information from CI providers (currently only **CircleCI**).
- The information it obtains is added to the **description** of the open Pull Request **without affecting it**, you can later add information to it, either before or after the contents added by this robot and your information will never be removed (but the message by the robot might change as you make changes to your PR).
- It tells you when your CI build failed or passed! Here are some screenshots:

_(A failing PR)_
![](https://i.imgur.com/1wP6o6K.png)

_(Later, when it passed)_
![](https://i.imgur.com/DX69z2e.png)

**The main features as a Github App boilerplate:**

**Other neat features for developers:**


## Maybe Future Features

This is what I have right now:
- A folder structure where all the event handlers are grouped by event
  name, so let's say we have a handler called `circleCIStatus` for the
  event `check_suite`, it will be located in
  `<ProjectRoot>/events/check_suite/circleCIStatus/index.js`. Where
  the handler file is an index.js file to leverage the existence of a
  folder to put relevant utilities in co-located files.
- A central `index.js` that subscribes only to the events where we
  have handlers, and runs these handlers as soon as one of these
  events is received.
- A handler for the event `check_suite` which fetches the pull request
  and updates the pull request's body with a simple message (the same
  as the one visible at the end of this body). It is fully unit
  tested! - This is my first handler, what it does might be simple,
  but it's almost what I want it to do.
- The repo is fully linted and prettified.
- The repo builds with CircleCI.

My current immediate plan:
- Make a function to fetch CircleCI's API to retrieve the current
  status of the build, then prettify this output as much as possible,
  then put this output at the bottom of the pull request's body. This
  function (or set of functions) will make sure the prettified status
  is only added once to the body.
- Call this function from two events, `check_suite` and
  `pull_request`, so if people remove the status from the pull request
  body, we add it again.

What I would love to do:
- It seems that I might have a decent amount of fun if I find a way to
  offer an optional code-formatting tool, where if the user sends a
  message in the PR, like `fmt`, or if they click on a link we put in
  the body, then we would fetch the repository locally, run `npm run
  fmt` to see if there are any files that need to be fixed, then push
  these changes to the same PR. I know how to do this with DangerJS,
  so it seems like I might be able to do it using PRobot. I'm not sure
  how far is this from the scope of this exercise though.
- If I ever reach this state, I think I will make another repo with a
  better name! The current name I picked was because the other ones I
  tried weren't available :(

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

Those were really the only things, the rest of it has been a breeze!
I'm impressed on how the utilities for Github apps have advanced since
I used the Github API for production applications (6 years ago).

---

The rest of the readme is very much WIP, just notes I've taken in the
process. I will clean this up as soon as I finish with the
functionalities, the tests and the in-comments documentation.

---

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
- Issues (read and write)
- Pull requests (read and write)

Subscribe to events:
- Check suite
- check run
- commit comment
- pull request
- pull request review
- pull request review comment

Then, install your app on the repositories you might want.

Then npm install in this repo

Links to check what's up with your app:
- ahttps://github.com/settings/apps/testgithubapp-sadasant
- https://github.com/settings/installations/228280

These two pages in the docs are incredibly powerful:
- https://probot.github.io/docs/simulating-webhooks/
- https://probot.github.io/docs/testing/
