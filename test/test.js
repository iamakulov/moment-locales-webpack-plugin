const path = require('path');
const { runWithWebpack } = require('./utils.js');
const MomentLocalesPlugin = require('../index.js');

describe('webpack build', () => {
    test('excludes all locales except specified', async () => {
        const modulePaths = await runWithWebpack({
            localesToKeep: ['en-gb', 'ru'],
        });

        const momentModule = modulePaths.find(path =>
            path.includes('moment/moment.js')
        );
        expect(momentModule).toBeTruthy();

        const localeModules = modulePaths.filter(path =>
            path.includes(`moment/locale`)
        );
        expect(localeModules).toHaveLength(2);
        expect(localeModules[0]).toMatch('moment/locale/en-gb');
        expect(localeModules[1]).toMatch('moment/locale/ru');
    });

    test('excludes all locales when none are specified', async () => {
        const modulePaths = await runWithWebpack({
            localesToKeep: [],
        });

        const momentModule = modulePaths.find(path =>
            path.includes('moment/moment.js')
        );
        expect(momentModule).toBeTruthy();

        const localeModules = modulePaths.filter(path =>
            path.includes(`moment/locale`)
        );
        expect(localeModules).toHaveLength(0);
    });

    test('works when no options are passed', async () => {
        const modulePaths = await runWithWebpack();

        const momentModule = modulePaths.find(path =>
            path.includes('moment/moment.js')
        );
        expect(momentModule).toBeTruthy();

        const localeModules = modulePaths.filter(path =>
            path.includes(`moment/locale`)
        );
        expect(localeModules).toHaveLength(0);
    });

    test('accepts the default locale (en)', async () => {
        const modulePaths = await runWithWebpack({
            localesToKeep: ['en'],
        });

        const momentModule = modulePaths.find(path =>
            path.includes('moment/moment.js')
        );
        expect(momentModule).toBeTruthy();

        const localeModules = modulePaths.filter(path =>
            path.includes(`moment/locale`)
        );
        expect(localeModules).toHaveLength(0);
    });

    test('normalizes locales to match the file names', async () => {
        const modulePaths = await runWithWebpack({
            localesToKeep: ['en-gb-foo'],
        });

        const momentModule = modulePaths.find(path =>
            path.includes('moment/moment.js')
        );
        expect(momentModule).toBeTruthy();

        const localeModules = modulePaths.filter(path =>
            path.includes(`moment/locale`)
        );
        expect(localeModules).toHaveLength(1);
        expect(localeModules[0]).toMatch('moment/locale/en-gb');
    });
});

describe('validation', () => {
    test('throws when an unknown option is passed', () => {
        expect(() => new MomentLocalesPlugin({ foo: 'bar' })).toThrow(
            /unknown option/
        );
    });

    test('throws when not an array is passed into `localesToKeep`', () => {
        expect(() => new MomentLocalesPlugin({ localesToKeep: {} })).toThrow(
            /Expected .+ option to be an array, received/
        );
    });

    test('throws when an invalid locale is passed into `localesToKeep`', () => {
        expect(
            () => new MomentLocalesPlugin({ localesToKeep: ['foo-bar'] })
        ).toThrow(/Moment.js doesn’t include/);
    });
});
