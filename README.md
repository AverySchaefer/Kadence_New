# Kadence_New

NEW Repository for the mobile application Kadence

Developers: Raymond Xie, Colston Streit, Avery Schaefer, Jackson Rosenberg, Nathan Simon

### Production Build

The current production build of the project resides at http://kadenceapp.com. Visit to see the current build of the project, which will be up to date with the "main" branch.

### ESLint and Prettier

ESLint is a linter for catching code quality/style issues and forcing you to fix them before building. To see error highlighting in-editor, you need to install the [ESLint extension](vscode:extension/dbaeumer.vscode-eslint) in the VSCode marketplace. Rules can be turned off within a file using a comment or globally in the `.eslintrc.json` file.

To make ESLint less annoying, the use of Prettier is highly recommended. Prettier helps to automatically format your code, and can be set to do this every time you save your file. To do this:

1. Install the [Prettier extension](vscode:extension/esbenp.prettier-vscode)
2. Open your VSCode settings (`Ctrl + ,`), search 'formatter', and then set your Default Formatter to 'Prettier - Code formatter'. Below this, enable "Format on Save"
3. Add a `.vscode/settings.json` file with this to the root of your workspace (the folder you opened in VSCode):

```JSON
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false, // required
  "editor.formatOnType": false, // required
  "editor.formatOnSave": true, // optional
  "editor.formatOnSaveMode": "file", // required to format on save
  "files.autoSave": "onFocusChange" // optional but recommended
}
```

If you opened the `Kadence_New` root directory as your workspace instead of the `Kadence_New/kadence` subdirectory, then you should add the following line to the end of your settings.json file to prevent weirdness: `"eslint.workingDirectories": ["kadence"]`

#### Common ESLint Errors

`{package} should be listed in the project's dependencies. Run 'npm i -S {package}' to add it`
If you see this for a package that you added as a dev-dependency, and you're sure that it should be a dev-dependency, then just make sure everything has been installed properly with `npm ci`, and then restart VSCode. The error should go away.

### Building On Web

NPM allows for testing on the web using a live build of the project. To build and use this feature, run the following command:
```bash
npm run dev
```
Then, navigate to the url shown (http://localhost:3000) and you will be taken to the libe build of the project in the repository you ran the project in.
Note that if you make any changes to the code while the live build is running, then save them, reloading the live web build will update the page to contain the changes you made.

### Building With Capacitor

Capacitor is a framework used to compile and export Next.js projects into cross-platform mobile applications. To build the project, use the following steps:

1. Within `"capacitor.config.ts"`, on line 9, modify the IP address listed to the IP address of your local machine
   a. This can be found by running

```bash
  ipconfig
```

on Windows or

```bash
  ipconfig getifaddr en0
```

on Mac. Do not modify the port number, as it is set to the default Node.js port. 2. run the following commands:

```bash
  npm run static
  npx cap copy
```

3. If you want to open an android emulator:
   a. Make sure the project folder is open in Android Studio
   b. Ensure you are within the directory `Kadence_New/kadence`
   c. Run the following command:

```bash
  npx cap open android
```

d. Once the command has finished, select the device you want to emulate and click the play button on the top menu 4. If you want to open an iOS emulator:
a. Make sure the project folder is open in XCode
b. Ensure you are within the directory `Kadence_New/kadence`
c. Run the following command:

```bash
  npx cap open ios
```

d. Make sure the signing account is setup within XCode (follow the on-screen prompts if this has not been done)
e. Make sure your connected device is listed at the top of the window and click play

Note that live reload has been turned on

### RUNNING TEST CASES

Jest test cases have been built for this project. To run test cases, do the following:

1. In a terminal window, run

```bash
  npm run dev
```

2. In a second terminal window, run

```bash
  npm run test
```

This will run the test suites. The output of the test suites will say what (if any) test cases have failed.

NOTE: You will get an error when running the test suite about an incorrect version number, you can safely ignore this error.
It will not impact the result of the test suites.
