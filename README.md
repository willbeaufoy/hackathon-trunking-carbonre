# Hack-a-trunk

This is a simple chat app built with Next.js, Firebase, and Playwright.  
The idea is to do browser based TDD on a trunk based development workflow.

By no means this is a good examplar of a final project! But is good fun!  
If you want a good example of how far things can be pushed, check out [this Twitter clone](https://github.com/ccrsxx/twitter-clone/tree/main) and [the live app itself](https://twitter-clone-ccrsxx.vercel.app/).

## Set up a new project

### Github

- Fork [this repo](https://github.com/carbon-re/hackathon-trunking-carbonre) and give it a nicer name ;)  
  _By default this will inherit public visibility!_

### Firebase

Firebase is a backend-as-a-service (BaaS) platform that provides a number of services, including authentication, storage, and a database.

- Create a new project in [Firebase](https://firebase.google.com/)
- Go to the project settings (gear icon next to "Project Overview") > Service Accounts
- Generate a new private key
- Store the firebase admin JSON safe and sound for later
- Go to Build > Authentication > Sign-in method
- Enable "Email/Password" and "Google"
- Go to Build > Firestore Database > Create database
- Select "Start in production mode"
- Deploy it to a location near you
- Go to Build > Storage > Get started
- Select "Start in production mode"
- Go to Project Overview > Web (third icon from the left, resembles HTML)
- Register a new app, you don't need to set up hosting  
  _The idea in Firebase is that you can have different apps (clients) talking against the same backend: web, android, ios, etc._
- Store the `firebaseConfig` object for later

### Vercel

Vercel is a cloud platform for static sites and serverless functions.

- Go to [Vercel](https://vercel.com/)
- Sign up with GitHub
- Import your repo
- Deploy  
  _This will fail, but no worries: we are going to add a GHA deployment workflow soon._
- Go to Account Settings > Tokens
- Create a new token and store it safe and sound for later

### GitHub 2: "Web" development

- Go to your repo > Settings > Secrets and variables > Actions
- Add the following Repository Secrets:

  - FIREBASE_API_KEY: firebaseConfig -> apiKey
  - FIREBASE_CLIENT_EMAIL: firebaseAdmin JSON -> client_email
  - FIREBASE_PRIVATE_KEY: firebaseAdmin JSON -> private_key
  - FIREBASE_PROJECT_ID: firebaseAdmin JSON -> project_id
  - VERCEL_ORG_ID: [vercel account](https://vercel.com/account) > settings > general -- at the bottom
  - VERCEL_PROJECT_ID: [dashboard](https://vercel.com/dashboard) > your project name > settings > general -- at the bottom
  - VERCEL_TOKEN: the token you created in Vercel

- Go to the repo Actions section and turn them on

- In another tab, open the .env file in the repository and type '.' anywhere in the page to start Codespace  
  Alternatively, you can replace github.com with github.dev in the URL
- Change the entries in the .env file copying from `firebaseConfig`
- Commit

- Go back to your Action tab and you should see your commit being tested and deployed (in parallel)
- Once the Vercel workflow succeed, open your project in Vercel and open the Domain link
- You should see a landing page - try logging in with Google

Oh no it failed! Open the console and Firebase will tell you that you need to authorise your domain

- Copy the URL
- Go to your Firebase project > Authentication > Settings > Authorized domains
- Add your domain e.g. `my-project.vercel.app`

You should get through the login now, but it failed again!  
This time the error message is a bit more cryptic...  
Hint: it's because we need to set up the Firestore rules.  
It's easier to fix from a local dev env, but let's keep going with this web development flow for a bit...

- Find a file in the repo called `firestore.rules`
- Copy the content
- Go to your Firebase project > Firestore Database > Rules
- Paste the content and publish
- Now refresh your app and you can start all your chatting!

## Local development

It will be much faster and funnier to develop locally!

### Java

You'll need Java to run the Firebase emulator.  
Follow your system instructions to install `java`.  
Confirm that is available in `PATH` by running e.g. `java -version`.

### Node

- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

- Install Node 16

```bash
nvm install 16
nvm use 16
nvm alias default 16  ## optional: make 16 the default node version
```

- Clone the repo

- Install the dependencies

```bash
npm install
```

- Run the Next.js dev server

```bash
npm run dev
```

This should fail with the following error:

```bash
...
error - FirebaseError: Firebase: Error (auth/invalid-api-key).
...
```

### Configure Firebase

The project is already set up for Firebase but needs your private and public keys.

- Add the Firebase key  
  Create `.env.local` with your Firebase API key:

```bash
echo "NEXT_PUBLIC_FIREBASE_API_KEY=${API_KEY}" > .env.local
```

_Note: the "API key" is in fact a [client side API key](https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different)_

Try running the dev server again and it should start correctly this time.  
The app should be accessible at <http://localhost:3000> but parts of the app will not work.  
This is because the Firebase local emulator needs to run alongside the Next.js dev server.

- Run Firebase in a separate terminal

```bash
npm run firebase:start
```

- You can conveniently spin up the app and Firebase with a single command

```bash
npm run firebase:dev
```

### Tests

It is imperative that you adopt a TDD approach to this project.  
The test approach is to only test user behaviour in the browser using Playwright.

- Run the tests  
  _Note: Playwright will spin up the app and/or Firebase if they are not already running._

```bash
npm run test:playwright
```

You should get an error about missing API keys.  
This is because we access the Admin SDK in the tests, and it needs to be configured with a service account key.

- Configure the Admin SDK

  ```bash
  cp .env.e2e.example .env.e2e
  ```

- Open `.env.e2e` and replace the placeholders with the values from your Firebase admin JSON

- Run the tests again and they should pass:

```bash
npm run test:playwright
```

### Deploy

Cool!  
Let's try a deployment!

```bash
# make a change anywhere
git commit -am "deploy"
```

That's it.  
Every commit to `main` will trigger a deployment to the prod environment.

### VSCode

Congratulations! You have set up the project!

Now do [get VSCode](https://code.visualstudio.com/download) and the following extension.  
You can find them in VSCode > Extensions > Search "@recommended".

- [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- [Playwright Trace Viewer for VSCode](https://marketplace.visualstudio.com/items?itemName=ryanrosello-og.playwright-vscode-trace-viewer)
- [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Here some VSCode extensions that will make your life easier:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) with [AutoSave](https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)

Once you install VSCode these extensions will be recommended.
ESLint and Prettier comes preconfigured on this project.

You might want to experiment with Copilot et similia for this project:

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [CodeWhisperer (AWS free Copilot)](https://docs.aws.amazon.com/codewhisperer/latest/userguide/setting-up.html#setting-up-toolkit)
