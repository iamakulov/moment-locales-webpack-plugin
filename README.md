# moment-locales-webpack-plugin

[![npm](https://img.shields.io/npm/v/moment-locales-webpack-plugin.svg)](https://www.npmjs.com/package/moment-locales-webpack-plugin) [![Travis](https://img.shields.io/travis/iamakulov/moment-locales-webpack-plugin.svg)](https://travis-ci.org/iamakulov/moment-locales-webpack-plugin) [![Greenkeeper badge](https://badges.greenkeeper.io/iamakulov/moment-locales-webpack-plugin.svg)](https://greenkeeper.io/)

> Easily remove unused Moment.js locales when building with webpack

## Why

75% (160 minified KBs)¹ of [Moment.js’](https://github.com/moment/moment) size are files used for localization. [They are always included](https://iamakulov.com/notes/webpack-front-end-size-caching/#moment-js) when you build your app with webpack.

You don’t need most of these files if your app is only available in a few languages. Use this plugin to strip these KBs and optimize the app!

<small>¹ – tested with Moment.js 2.18.1</small>

## Install

```sh
npm install --save-dev moment-locales-webpack-plugin
```

## Usage

```js
// webpack.config.js
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),

        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        new MomentLocalesPlugin({
            localesToKeep: ['es-us', 'ru'],
        }),
    ],
};
```

## Plugin Options

### **`localesToKeep: String[]`**

An array of locales to keep bundled (other locales would be removed).

Locale names follow Moment.js behavior – if a specific locale name (e.g. `ru-ru`) is absent, but a more generic locale (`ru`) is available, the generic one will be kept bundled.

### **`ignoreInvalidLocales: Boolean`**

A flag to ignore invalid or unsupported locales in the `localesToKeep` array.

Be careful! A typo in the `localesToKeep` array with this flag enabled will silently exclude the desired locale from your bundle.

## Related projects

-   [`moment-timezone-data-webpack-plugin`](https://github.com/gilmoreorless/moment-timezone-data-webpack-plugin) – a plugin optimizing the Moment Timezone library.

## Contributing

See [CONTRIBUTING.md](https://github.com/iamakulov/moment-locales-webpack-plugin/blob/master/CONTRIBUTING.md) for how to contribute.

## License

MIT © <a href="https://iamakulov.com">Ivan Akulov</a>
