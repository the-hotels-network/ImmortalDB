module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
        '.js': 'jest-esm-transformer',
    },
};
