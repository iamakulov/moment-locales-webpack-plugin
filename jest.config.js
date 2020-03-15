const webpackPackage = process.env.WEBPACK_PACKAGE;

module.exports = {
    moduleNameMapper: {
        '^webpack$': webpackPackage,
        '^webpack/(.*)': `${webpackPackage}/$1`,
    },
};
