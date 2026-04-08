# Contribution Guide for Toronto JS' Webring

Thank you for your interest in contributing to the project.
This guide contains all you need to setup and make changes to the code.

If you are looking to just add your website to the webring go to the ["How to" page](https://webring.torontojs.com/how-to) instead

## Assumptions

We assume you have a basic knowledge of web development and `git`.
But if you need help setting up, please contact one of the contributors so we can help getting things running.

## Prerequisites

- **Required:** [`node.js`](https://nodejs.org/en/download/prebuilt-installer) (Preferably managed by [`mise`](https://mise.jdx.dev/getting-started.html))
- **Required:** [`pnpm`](https://pnpm.io/installation)
- _Recommended:_ [VS Code](https://code.visualstudio.com/Download)

## Cloning and configuring for local development

1. Clone the repository
2. Run `pnpm install`

## Running the local server

Run `pnpm start` to start the local server. This uses Netlify Dev to emulate the production environment.

## Deploying

Push to `main` to deploy to Netlify. The site is deployed at https://webring.torontojs.com

## Notes on the codebase

- The code uses [TypeScript](https://www.typescriptlang.org/)
- The project runs on [Netlify Functions](https://docs.netlify.com/functions/overview/)
