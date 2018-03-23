// This file is used to check the plugin for syntax errors
// in older versions of Node (e.g., Node v4).
// We’re wrapping webpack with proxyquire because
// webpack 4 only supports Node.js v6+
// (but the plugin works with older versions of webpack too).

const proxyquire = require('proxyquire');

const Plugin = proxyquire('../index.js', {
    webpack: {
        IgnorePlugin: function() {},
        ContextReplacementPlugin: function() {},
    },
});

new Plugin();
