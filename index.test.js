const MomentLocalesPlugin = require('./index.js');

test('returns a ContextReplacementPlugin instance when locales are passed', () => {
    const result = new MomentLocalesPlugin({
        localesToKeep: ['en-gb', 'ru'],
    });

    expect(result.constructor.name).toEqual('ContextReplacementPlugin');
    expect(result.newContentRegExp.toString()).toEqual(
        '/(en-gb\\.js|ru\\.js)$/'
    );
});

test('returns an IgnorePlugin instance when locales are not passed', () => {
    const result = new MomentLocalesPlugin({
        localesToKeep: [],
    });

    expect(result.constructor.name).toEqual('IgnorePlugin');
});

test('works when no options are passed', () => {
    const result = new MomentLocalesPlugin();

    expect(result.constructor.name).toEqual('IgnorePlugin');
});

test('normalizes locales to match file names', () => {
    const result = new MomentLocalesPlugin({
        localesToKeep: ['en-gb-foo'],
    });

    expect(result.newContentRegExp.toString()).toMatch(/en-gb\\.js/);
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
