module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'react'
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  globals: {
    'NODE_ENV': true
  },
  rules: {
    // add your rules here
    'semi': ['error', 'always'],
    'no-undef': 'error'
  }
};