const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);

  // enable code coverage collection
  require('@cypress/code-coverage/task')(on, config);

  return config;
};
