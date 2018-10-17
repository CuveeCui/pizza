const config = require('./webpack.config.base');
const merge = require('webpack-merge');


const testConfig = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [...utils.initLoaders()]
  }
})


delete testConfig.entry;

module.exports = testConfig;