# Introduction

Welcome to the Personal Newsletter Manager - a software for sending personal newsletters.

This is a desktop software (written using Angular and Electron, based on https://github.com/maximegris/angular-electron.git ) with to goal to build a newsletter software to stay in touch with friends. Its like a hybrid between personal mailing and newsletter.

These are the Features that bring the personal touch:
- You can add a personal message block to newsletters.
- Your personal email address is used (like you would using a mailer software). Unfortunately currently only Google E-Mail Accounts are supported.
- Data is stored locally on you computer (its your friends.. no webservice should know their contact data).
- PLANNED: On the page on which you write personal messages, your conversation with the respective person is displayed next to the input field for the personal message.
- PLANNED: Send and receive messages via Messenger too (as you do with friends)

Here are a couple of screenshots to give you an Idea how this software works:

![plot](./docs/assets/Screenshot%20001.PNG)

![plot](./docs/assets/Screenshot%20002%20-%20Add%20Recipient.PNG)

![plot](./docs/assets/Screenshot%20003%20-%20Recipient%20List.PNG)

![plot](./docs/assets/Screenshot%20005%20-%20New%20newsletter.PNG)

![plot](./docs/assets/Screenshot%20006%20-%20Newsletter%20List.PNG)

![plot](./docs/assets/Screenshot%20009%20-Send%20step%201.PNG)

![plot](./docs/assets/Screenshot%20010%20-Send%20step%202.PNG)

![plot](./docs/assets/Screenshot%20012%20-Send%20step%203.PNG)

![plot](./docs/assets/Screenshot%20015%20-Newsletter%20View%20Page.PNG)

## Getting Started

Manual on how to get OAuth running:
https://www.youtube.com/watch?v=-rcRf7yswfM
 
Clone this repository locally :

``` bash
git clone https://github.com/hwalde/personal-newsletter-manager.git
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` when the application is built by the packager. Please use `npm` as dependencies manager.


If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** -> npm start

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.
The Angular component contains an example of Electron and NodeJS native lib import.
You can disable "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## Use Electron / NodeJS / 3rd party libraries

As see in previous chapter, this sample project runs on both mode (web and electron). To make this happens, **you have to import your dependencies the right way**. Please check `providers/electron.service.ts` to watch how conditional import of libraries has to be done when using electron / NodeJS / 3rd party librairies in renderer context (ie. Angular).

## Browser mode

Maybe you only want to execute the application in the browser with hot reload ? Just run `npm run ng:serve:web`.

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:build`| Builds your application and creates an app consumable based on your operating system |

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**

