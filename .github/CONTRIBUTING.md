# Contribution Guide for Toronto JS' Webring

Thank you for your interest in contributing to the project.
This guide contains all you need to setup and make changes to the code.

If you are looking to just add your website to the webring go to the ["How to" page](https://webring.torontojs.com/how-to) instead

## Assumptions

We assume you have a basic knowledge of web development and `git`.
But if you need help setting up, please contact one of the contributors so we can help getting things running.

## Prerequisites

- **Required:** [`node.js`](https://nodejs.org/en/download/prebuilt-installer) (Preferably managed by [`mise`](https://mise.jdx.dev/getting-started.html))
- **Required:** [`mkcert`](https://github.com/FiloSottile/mkcert)
- **Required:** [`pnpm`](https://pnpm.io/installation)
- **Required:** [Commit signing configured](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- _Recommended:_ [VS Code](https://code.visualstudio.com/Download)

## Cloning and configuring for local development

1. Clone the repository
2. Run `pnpm run bootstrap`

## Running the local server

Run `pnpm start` to start the local server

## Notes on the codebase

- The code uses [Typescript](https://www.typescriptlang.org/)
- The project runs on [Cloudflare Workers](https://developers.cloudflare.com/workers/)
