const path = require('path');
const webpack = require('webpack');
const tempDir = require('temp-dir');
const MomentLocalesPlugin = require('../index.js');

const runWithWebpack = (pluginOptions) => {
    return new Promise((resolve, reject) => {
        webpack(
            {
                mode: 'none',
                entry: path.resolve(__dirname, 'fixtures', 'index.js'),
                output: {
                    path: tempDir,
                    filename: 'moment-locales-build.js',
                },
                plugins: [new MomentLocalesPlugin(pluginOptions)],
            },
            (err, stats) => {
                if (err || stats.hasErrors()) {
                    reject(err || stats);
                }

                const modulePaths = stats.compilation.modules
                    .map((i) => i.resource)
                    .filter(Boolean)
                    .map((path) => path.replace(/\\/g, '/'));

                resolve(modulePaths);
            }
        );
    });
};

exports.runWithWebpack = runWithWebpack;
