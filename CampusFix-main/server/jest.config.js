module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testTimeout: 30000,
  reporters: ['default', ['jest-junit', { outputName: 'junit.xml' }]],
};
