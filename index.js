var arrayDifference = require('lodash.difference');
var moment = require('moment');
var ContextReplacementPlugin = require('webpack').ContextReplacementPlugin;

function checkOptions(options) {
    var optionsObject = options || {};

    var supportedOptions = ['localesToKeep', 'ignoreInvalidLocales'];
    var unknownOptions = arrayDifference(
        Object.keys(optionsObject),
        supportedOptions
    );
    if (unknownOptions.length > 0) {
        throw new Error(
            'MomentLocalesPlugin: received unknown options: ' +
                unknownOptions.join(', ') +
                '. Only `localesToKeep` and `ignoreInvalidLocales` options are supported at the moment'
        );
    }

    var localesToKeep = normalizeLocalesToKeep(optionsObject);

    return {
        localesToKeep: localesToKeep,
    };
}

function normalizeLocalesToKeep(optionsObject) {
    var localesToKeep = optionsObject.localesToKeep || [];

    // Check if an array
    if (!Array.isArray(localesToKeep)) {
        throw new Error(
            'MomentLocalesPlugin: Expected the `localesToKeep` option to be an array, received ' +
                (JSON.stringify(localesToKeep) || localesToKeep) +
                '. Pass an array, like this:\nmodule.exports = {\n  plugins: [\n    new MomentLocalesPlugin({\n' +
                "      localesToKeep: ['en-us', 'ru']\n    })\n  ]\n}"
        );
    }

    // Check if it has unsupported locales
    var unsupportedLocales = getUnsupportedLocales(localesToKeep);
    if (!optionsObject.ignoreInvalidLocales && unsupportedLocales.length > 0) {
        throw new Error(
            'MomentLocalesPlugin: Moment.js doesn’t include ' +
                (unsupportedLocales.length === 1
                    ? 'a locale you specified: '
                    : 'a few locales you specified: ') +
                unsupportedLocales.join(', ') +
                '. Check the plugin’s `localesToKeep` option.\nYou can see the full list of locales ' +
                'that Moment.js includes in node_modules/moment/locale/.\n' +
                'If you would like unsupported locales to be ignored, please use the `ignoreInvalidLocales` option.'
        );
    }

    // Filter out supported locales to keep
    var normalizedLocales = localesToKeep.filter(function(localeName) {
        return (
            unsupportedLocales.indexOf(localeName) === -1 &&
            // 'en' is built into Moment, so it doesn't exist in the locales context
            localeName !== 'en'
        );
    });

    // Normalize the locales to match the file names
    // (i.e. `en-gb-foo` would be recognized by Moment as `en-gb`,
    // but no `en-gb-foo.js` file exists)
    return normalizedLocales.map(function(localeName) {
        return moment.localeData(localeName)._abbr;
    });
}

function getUnsupportedLocales(locales) {
    // In some use cases, customers already have a moment locale set globally
    // (e.g., this is a case in https://github.com/nuxt-community/moment-module/issues/25).
    // We need to save the customer locale and restore it later
    var customerActiveLocaleName = moment.locale();

    var defaultGlobalLocaleName = 'en';
    moment.locale(defaultGlobalLocaleName);

    var unsupportedLocales = locales.filter(function(customerLocaleName) {
        var momentLocaleData = moment.localeData(customerLocaleName);
        var momentLocaleName = momentLocaleData && momentLocaleData._abbr;

        return (
            // For Moment 2.20.1−: `moment.localeData()` returns `null` if the passed locale is unsupported
            momentLocaleName === null ||
            // For Moment 2.21.0+: `moment.localeData()` returns the currently active locale
            // if the passed locale is unsupported
            (momentLocaleName === defaultGlobalLocaleName &&
                // Just in case the customer passes `en` in `localesToKeep`
                customerLocaleName !== defaultGlobalLocaleName)
        );
    });

    moment.locale(customerActiveLocaleName);

    return unsupportedLocales;
}

function MomentLocalesPlugin(options) {
    var normalizedOptions = checkOptions(options);

    var localesToKeep = normalizedOptions.localesToKeep;

    var regExpPatterns = localesToKeep.map(function(localeName) {
        return localeName + '(\\.js)?';
    });
    var regExpForLocales =
        regExpPatterns.length > 0
            ? // A regexp that matches only locales we want to bundle
              new RegExp('[/\\\\](' + regExpPatterns.join('|') + ')$')
            : // A regexp that doesn’t match anything – per https://stackoverflow.com/a/2930280/1192426
              /\b\B/;

    return new ContextReplacementPlugin(/moment[\/\\]locale/, regExpForLocales);
}

module.exports = MomentLocalesPlugin;
