# Logic-Simulator

### Project Description
- A experiement on digital circuit simulation using [_SimcirJS_](https://github.com/kazuhikoarase/simcirjs) opensource library.
- A cross-platform web and desktop application made using [_ElectronJS_](https://www.electronjs.org/) and [_Svelte_](https://svelte.dev/) and built using [_Vite_](https://vitejs.dev/). 
- Requires [_NodeJS_](https://nodejs.org/) to be installed locally on your machine.

### Scaffolding
Run following scripts from CLI:
#### Creating Vite Project
```cmd
npm init vite
```
```cmd
✔ Project name: CircuitSimulationElectronSvelte
✔ Select a framework: › Svelte
✔ Select a variant: › TypeScript

Scaffolding project in ~/CircuitSimulationElectronSvelte...

Done. Now run:

  cd CircuitSimulationElectronSvelte
  npm install
  npm run dev
```
#### Installing Node Modules
```cmd
npm install
```
#### Installing ElectronJS
```cmd
npm install --save-dev electron
```
Refer _Project Creation Guidleines_ from referances.

### App Folder Structure
Each sub-folder contains its own `tsconfig.json` and `vite.config.ts`
```bash
CircuitSimulationElectronSvelte/
├─ node_modules/
├─ dist/                  # Contain compiled output from each package.
│  ├─ renderer/           # Compiled output of renderer process.
│  ├─ main/               # Compiled output of main process.
│  ├─ preload/            # Compiled output of preload process.
│
├─ app/
│  ├─ renderer/           # Contains renderer process. Svelte source-code
│  │  ├─ src/
│  │  ├─ index.html       # Root HTML file where all Svelte components are rendered  
│  │  ├─ svelte.config.js # Svelte configuration file
│  │  ├─ vite.config.ts   # Vite config for renderer source-code
│  │  ├─ tsconfig.json    # Specific TypeScript config. Excludes .js files
│  ├─ main/               # Contains main process. ElectronJS source-code
│  │  ├─ src/
│  │  ├─ vite.config.ts   # Vite config for main source-code.
│  │  ├─ tsconfig.json    # Specific TypeScript config.
│  ├─ preload/            # Contains preload script. ElectronJS script runs before code is rendered
│  │  ├─ src/
│  │  ├─ vite.config.ts   # Vite config for preload source-code.
│  │  ├─ tsconfig.json    # Specific TypeScript config.
│
├─ package.json           # Contains the dependencies for all our packages.
├─ tsconfig.node.json     # Root file TypeScript config generated by Vite CLI.
```

### Scripts
`package.json`
```json
{
  ...  
  "scripts": {
    "dev:renderer": "vite app/renderer",
    "build:renderer": "tsc -p app/renderer/tsconfig.json --noEmit && vite build app/renderer",
    "build:preload": "tsc -p app/preload/tsconfig.json --noEmit && vite build app/preload",
    "build:main": "tsc -p app/main/tsconfig.json --noEmit && vite build app/main",
    "build": "npm run build:renderer && npm run build:preload && npm run build:main",
    "start": "electron ."
  },
  ...
}
```
#### Web Local Host
Hosts the Svelte-Application locally which changes real-time as changes are made to the code
```cmd
npm run dev:renderer
```
#### Build Application
Each build command builds a specific aspect folder of the _app_. Firstly _TypeScript_ compiler checks for any errors in `.ts` files and then _Vite_ is used to build the project.
```cmd
npm run build:renderer
npm run build:preload
npm run build:main
```
The combined command builds the entire project 
```cmd
npm run build
```
#### Run desktop
The following command is used to start the Electron builder to start the desktop application.
```cmd
npm run start
```

### Project Maintainace Guidelines
#### index.html
ALways maintain a clean `index.html` file. There should be no dependencies like linking of stylesheets and javascripts files here. If such files are external, they should be downloaded as a _npm module_ or directly imported into `.svelte` or `.ts` file.

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Circuit Simulation</title>
  </head>
  <body style="margin: 0px;">
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```
#### .svelte
- Always maintain a clean `App.svelte` file. It should only _import_ `.svelte` components and render them.
- There should be no function definations in `.svelte` files. They must only _import_ functions or properties from `.ts` file from _assets_ or `.js` file from _external_.
- For the sake of convinience, there is no direct `html` in `.svelte` files. Instead we use _SvelteStrap_. A _svelte_ framework which abstracts use of _bootstrap_.

`App.svelte`
```html
<script lang="ts">
    import Canvas from './lib/Canvas.svelte';
    import Menubar from './lib/Menubar.svelte';
</script>

<Menubar />
<Canvas />
```
#### simcir
- Project specific changes made to the external _simcir_ library can be found by searching `Custom simcir` through the file.
- In order to link other _simcir_ `.js` files, you must import them into `canvas.ts` file.

`canvas.ts`
```ts
import '../external/js/simcir-basicset.js'
import '../external/js/simcir-library.js'
```
#### Naming Convention
- There is a `.ts` file in _assets_ of the same name as a `.svelte` file in _lib_. This `.ts` file contains all the necessary functions and event handlers required by its corresponding `.svelte` file. 
eg. `Canvas.svelte` and `canvas.ts`
- All `.svelte` files or _svelte components_ must be named using the _Pascal Casing_. 
eg. `DialogueBox.svelte`
- For naming the `.ts` files in _assets_, we must separate each compound word with a hyphen. 
eg. `event-handler.ts`
- All names of variables or functions must follow _Camel Casing_. 
eg. `isRegisterDeviceDialogueBoxOpen`

### Project Specific Configuration
`app/renderer/tsconfig.json`
```json
{
  "compilerOptions": {
    // Allows importing .js files in .ts
    "allowJs": false, 
    // Does not type check .js files
    "checkJs": false, 
  },
  // Does not contain .js file
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.svelte"] 
}
```

### References
- [Project Creation Guidelines](https://www.jsgarden.co/blog/electron-with-typescript-and-vite-as-a-build-system)
- [Bootstrap For Vite Installation](https://getbootstrap.com/docs/5.2/getting-started/vite/)
- [Sveltestrap Documentation](https://sveltestrap.js.org/)
