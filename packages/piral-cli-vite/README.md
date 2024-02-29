[![Piral Logo](https://github.com/smapiot/piral/raw/main/docs/assets/logo.png)](https://piral.io)

# [Piral CLI Vite](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral-cli-vite/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/piral-cli-vite.svg?style=flat)](https://www.npmjs.com/package/piral-cli-vite) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

This plugin enables using [Vite](https://vitejs.dev/) as the bundler for Piral instances and pilets.

## Installation

Use your favorite npm client for the installation:

```sh
npm i piral-cli-vite --save-dev
```

**Note**: If you don't install any bundler for use in `piral-cli` then `piral-cli-vite` will be automatically installed for you.

## Using

There is nothing to do. Standard commands such as `piral build` or `pilet debug` will now work with Vite as the bundler.

This plugin comes with batteries included. You don't need to install or specify your Vite version.

### What's Inside

Right now it includes:

- `vite-plugin-codegen`
- `vite-plugin-environment`

Additionally, most known referenced assets are handled as files.

As such it should be prepared to include assets (images, videos, ...), stylesheets (CSS and SASS), and work with TypeScript.

### Public Folder

By default the source folder (e.g., `/src`) is set as root. Therefore, the `src/public` folder (if available) will be used for the public assets. If you want to change this you can use a custom Vite config as explained below, e.g.:

```js
import { resolve } from 'path';

export default {
  publicDir: resolve(__dirname, 'public'),
}
```

### Referencing Scripts

Vite uses all scripts with `type=module` to be entry points in the *index.html* file. However, as you might just have scaffolded a solution or are more used to simply have `<script src="./index.tsx">` in your HTML file we patch the *index.html* to match exactly that. Nevertheless, this creates a problem if you want to, for instance, reference some scripts that should **not** be part of the bundling (or would only exist later).

One thing to do here is to put some attribute to the script, i.e., transform

```html
<script src="./do-not-pick-up.js"></script>
```

to

```html
<!-- version below if order and immediate are relevant -->
<script blocking src="./do-not-bundle.js"></script>
<!-- version below if order is relevant, but immediate is not relevant -->
<script defer src="./do-not-bundle.js"></script>
<!-- version below if order and immediate are irrelevant -->
<script async src="./do-not-bundle.js"></script>
```

### Customizing

If you want to customize the given config (e.g., to add more plugins) then create a file *vite.config.js* (or anything else accepted by Vite, e.g., *vite.config.ts*) in your root directory.

In the most trivial version the file looks as follows:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  // Your config additions here
});
```

If you want to add some plugin you could do:

```js
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
});
```

The configuration works with all formats that Vite supports.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
