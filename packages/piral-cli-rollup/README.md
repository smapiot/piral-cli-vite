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

- ...

Additionally, most known referenced assets are handled as files.

As such it should be prepared to include assets (images, videos, ...), stylesheets (CSS and SASS), and work with TypeScript.

### Customizing

If you want to customize the given config (e.g., to add more plugins) then create a file *vite.config.js* in your root directory.

In the most trivial version the file looks as follows:

```js
module.exports = function(config) {
  return config;
};
```

This would just receive the original build config and return them, i.e., essentially not doing anything. If you want to add some plugin you could do:

```js
const fooPlugin = require('vite-plugin-foo');

module.exports = function(config) {
  config.plugins.push(fooPlugin());
  return options;
};
```

There are no overrides applied afterwards. Therefore, what you modify will remain in the config.

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
