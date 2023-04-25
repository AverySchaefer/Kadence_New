const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    // This runs jest.setup.js so the next.config is available to our tests
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // This resolves our [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases)
    // in Jest tests to their absolute paths
    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/$1',
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
