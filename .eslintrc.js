const env = process.env.NODE_ENV;
const config = require('./config');
module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'react'
  ],
  extends: [
    "standard",
    "plugin:react/recommended"
  ],
  settings: {
    react: {
      version: '16.5'
    }
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    'NODE_ENV': true
  },
  rules: env === 'production' ? config.build.rules : config.dev.rules
};