var arrayDifference = require('lodash.difference');
var moment = require('moment');
var IgnorePlugin = require('webpack').IgnorePlugin;
var ContextReplacementPlugin = require('webpack').ContextReplacementPlugin;

function isModuleAvailable(moduleName) {
    try {
        require.resolve(moduleName);
        return true;
    } catch (e) {
        return false;
    }
}

function checkOptions(options) {
    var optionsObject = options || {};

    var supportedOptions = ['localesToKeep'];
    var unknownOptions = arrayDifference(
        Object.keys(optionsObject),
        supportedOptions
    );
    if (unknownOptions.length > 0) {
        throw new Error(
            'MomentLocalesPlugin: received unknown options: ' +
                unknownOptions.join(', ') +
                '. Only `localesToKeep` option is supported at the moment'
        );
    }

    var localesToKeep = normalizeLocalesToKeep(
        optionsObject.localesToKeep || []
    );

    return {
        localesToKeep: localesToKeep,
    };
}

function normalizeLocalesToKeep(localesToKeep) {
    // Check if an array
    if (!Array.isArray(localesToKeep)) {
        throw new Error(
            'MomentLocalesPlugin: Expected the `localesToKeep` option to be an array, received ' +
                (JSON.stringify(localesToKeep) || localesToKeep) +
                '. Pass an array, like this:\nmodule.exports = {\n  plugins: [\n    new MomentLocalesPlugin({\n' +
                "      localesToKeep: ['en-us', 'ru']\n    })\n  ]\n}"
        );
    }

    // 'en' is built into Moment, so it doesn't exist in the locales context
    localesToKeep = localesToKeep.filter(function(localeName) {
        return localeName !== 'en';
    });

    // Check if it has unknown locales
    var absentLocales = localesToKeep.filter(function(localeName) {
        var localeData = moment.localeData(localeName);
        return (
            // For Moment 2.20.1−
            localeData === null ||
            // For Moment. 2.21.0+ – this version now returns the localeData of the currently set locale, instead of null
            localeData === moment.localeData()
        );
    });
    if (absentLocales.length > 0) {
        throw new Error(
            'MomentLocalesPlugin: Moment.js doesn’t include ' +
                (absentLocales.length === 1
                    ? 'a locale you specified: '
                    : 'a few locales you specified: ') +
                absentLocales.join(', ') +
                '. Check the plugin’s `localesToKeep` option.\nYou can see the full list of locales ' +
                'that Moment.js includes in node_modules/moment/locale/'
        );
    }

    // Normalize the locales to match the file names
    // (i.e. `en-gb-foo` would be recognized by Moment as `en-gb`,
    // but no `en-gb-foo.js` file exists)
    return localesToKeep.map(function(localeName) {
        return moment.localeData(localeName)._abbr;
    });
}

function MomentLocalesPlugin(options) {
    var normalizedOptions = checkOptions(options);

    var localesToKeep = normalizedOptions.localesToKeep;

    if (localesToKeep.length > 0) {
        var regExpPatterns = localesToKeep.map(function(localeName) {
            return localeName + '(\\.js)?';
        });

        return new ContextReplacementPlugin(
            /moment[\/\\]locale/,
            new RegExp('(' + regExpPatterns.join('|') + ')$')
        );
    } else {
        return new IgnorePlugin(/^\.\/locale$/, /moment$/);
    }
}

module.exports = MomentLocalesPlugin;
