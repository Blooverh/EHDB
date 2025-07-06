export default {
    transform: {},
    testEnvironment: 'node',
    transformIgnorePatterns: [
        '/node_modules/(?!(puppeteer|another-es-module-package-if-needed))'
    ],
    moduleFileExtensions: ['js', 'json', 'node'],
};