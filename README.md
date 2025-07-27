# 'marks
**A browser extension that allows you to view and manage your bookmarks right from your browser's start page**

---
  

## Table of Contents

- [Developer Documentation](#developer-documentation)
  - [Prerequisites](#prerequisites)
  - [Overview](#overview)
    - [Scripts](#scripts)
    - [Architecture](#Architecture)
  - [Running the Extension](#running-the-extension)
  - [Resources](#resources)


## Developer Documentation

### Prerequisites
- Install [VS Code](https://code.visualstudio.com/download)
  - Install [Vue Language Features extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
    - Follow [instructions](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669=) for disabling VSCode's Typescript and Javascript Language Features for this workspace.
  - Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - Install [Tailwind CSS IntelliSense extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Overview
- #### Scripts
  - #### `npm run dev`
    - Runs `web-ext run` and `vite build` to reload the extension and rebuild on file changes
      - *Note that this does not include type checking in favor of faster feedback when developing. Type checking during development relies on the **Vue Language Features extension***.
  - #### `npm run test`
    - Runs vitest to run unit tests
  - #### `npm run build`
    - Builds, type checks, and packages the extension
- #### Architecture
  - App
    - Combines components with composables to make up the UI
  - Services
    - Combines data access and other services into a clean interface for the app
  - Data
    - Used by services to access data from the Web Extensions API and localStorage
### Running the Extension
- #### Firefox
  1. Run `npm install`
  1. Run `npm run dev`
  1. Open Firefox and go to `about:debugging`
  1. Select **This Firefox**
  1. Select **Load Temporary Add-on...**
  1. Select the **manifest.json** file in the dist directory and select **Open**
  1. Open a new tab and you will see 'marks
- #### Chrome
  1. Run `npm install`
  1. Run `npm run dev`
  1. Open Chrome and go to `chrome://extensions/`
  1. Toggle **Developer mode** on
  1. Select **Load unpacked**
  1. Select the dist directory and select **Open**
  1. Open a new tab and you will see 'marks

### Resources
- [MDN WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Vue](https://vuejs.org/)

### Inspirations
- [TailwindUI](https://tailwindui.com/)
