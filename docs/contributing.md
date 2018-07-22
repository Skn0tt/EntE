# Contributing to EntE

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

## How to Contribute

First, create an issue stating the problem and wait for an answer so you can be sure nobody else works on the same issue.
Then, fork the Repo and make your fixes.
After testing them (consider implementing Unit- or E2E-Tests, for Bug-Fixes a Regression Test would be great), create a merge request.
I will happily review and merge the request!

## What Should I Know Before I Get Started?

EntE consists of a row of packages, all managed by [Lerna](https://github.com/lerna/lerna).
After cloning the repository, use `lerna bootstrap` to install all dependencies and link the packages.

The packages are located in the folder `/packages` and are divided by domain.
A small overview:

| Package        | Purpose                                            |
| -------------- | -------------------------------------------------- |
| ente-api       | REST-API, deals with Auth and RBAC                 |
| ente-db        | Database Access Code                               |
| ente-lang      | Translations for the Frontend                      |
| ente-mail      | Email-Templates                                    |
| ente-parse     | Parser for CSV user imports to JSON representation |
| ente-ui        | React SPA that you see in the browser              |
| ente-validator | Validates various data inputs                      |

The most important packages are `ente-api` and `ente-ui`, most of the logic is in there.

To start a local dev environment, build all images with `make build-docker` and start them with `docker-compose up -d`.
For a quick feedback cycle, you can mount your sources into the container with `make dev`.
When working on the UI, make sure to run `yarn start` in there to start the bundler.
