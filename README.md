# Kadence_New

NEW Repository for the mobile application Kadence

Developers: Raymond Xie, Colston Streit, Avery Schaefer, Jackson Rosenberg, Nathan Simon

### Production Build

The current production build of the project resides at https://kadenceapp.com, which will be up to date with the "main" branch.

## Setting up the Development Environment

### Example .env File

```
# Create an application in Spotify to get these
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
KADENCE_SPOTIFY_REFRESH_TOKEN=
# Generate a random using: openssl rand -base64 32
NEXTAUTH_SECRET=
# Create an application in Fitbit that has type "Personal" to get these
FITBIT_PERSONAL_CLIENT_ID=
FITBIT_PERSONAL_CLIENT_SECRET=
```

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

### Running the App

To run the app in development mode with live reloading, run the following command:

```bash
npm run dev
```

Then, navigate to the url shown (http://localhost:3000).

### Running Test Cases

To run the Jest tests, do the following:

```
  npm run test
```

The output of the test suites will say what (if any) test cases have failed.

### Building With Capacitor

Capacitor is a framework used to compile and export Next.js projects into cross-platform mobile applications. To build the project, use the following steps:

1. Run the following commands to build the static files for the app, and then copy them over to the native platform project.

```bash
  npm run static
  npx cap copy
```

NOTE: If you don't have an `android/` folder under `kadence/`, run `npx cap add android`

2. If you want to open an android emulator:
   a. Make sure the project folder is open in Android Studio
   b. Ensure you are within the directory `Kadence_New/kadence`
   c. Run the following command:

```bash
  npx cap open android
```

d. Once the command has finished, select the device you want to emulate and click the play button on the top menu

4. If you want to open an iOS emulator:
   a. Make sure the project folder is open in XCode
   b. Ensure you are within the directory `Kadence_New/kadence`
   c. Run the following command:

```bash
  npx cap open ios
```

d. Make sure the signing account is setup within XCode (follow the on-screen prompts if this has not been done)
e. Make sure your connected device is listed at the top of the window and click play

Note that live reload has been turned on

### Deeplinking On Mobile

Mobile deeplinking is when you click a URL on mobile and are redirected into a mobile app. We have set this up for the https://kadenceapp.com domain. To make this work in your Capacitor build, you must build a _signed_ APK.

1. In Android Studio, go to Build > Generate Signed Bundle or APK
2. Pick the path to your keystore OR generate a new one. Enter the alias and password.
3. Generate the APK. It should appear under android/app/release/app-release.apk
4. While an emulator is open, run `adb install ./app-release.apk` in the Terminal of Android Studio
5. Send yourself a text with a link like `https://kadenceapp.com/profile`. It should redirect you to the right place in the app.

If you get an error like `[INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.kadenceapp signatures do not match previously installed version; ignoring!]`, then you need to uninstall any previously installed "Kadence" apps on your Android emulator.

If you get `Failure [INSTALL_PARSE_FAILED_NO_CERTIFICATES: Scanning Failed.: No signature found in package of version 2 or newer for package com.kadenceapp]`, you need to make sure you're signing using the [V2 signature scheme](https://stackoverflow.com/a/43097991).

If all else fails, try a "Clean Project" followed by a "Rebuild Project" under Build in Android Studio.
For more info on setting up deeplinks, check out this [video](https://www.youtube.com/watch?v=tAQwllZSQD8).
