## Getting started
### Node
- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
- Install Node 18
```bash
nvm install 18
nvm use 18
nvm alias default 18  ## optional: make 18 the default node version
```
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
The project is already set up.  

- Add the Firebase key  
Ask for the API key, and create an `.env.local` file with it:
```bash
echo $API_KEY > .env.local
```
_Note: the "API key" is in fact a [client side API key](https://firebase.google.com/docs/projects/api-keys#api-keys-for-firebase-are-different)_

Try running the dev server again and it should start correctly this time.  
The app should be accessible at http://localhost:3000 but parts of the app will not work.  
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
Ask for the `.env.e2e` file.

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

Now do [get VSCode](https://code.visualstudio.com/download) and the following extension:
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
