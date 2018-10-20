const Utils = require('./utils');
const utils = new Utils();
const params = require('../config');
const config = {
  entry: {
    main: utils.resolve('src/main')
  },
  output: {
    path: utils.resolve('dist'),
    filename: `${params.dev.directory}/js/[name].[hash].js`,
    publicPath: params.dev.publicPath
  },
  resolve: {
    extensions: ['.js', '.scss', '.css'],
    alias: {
      '@': utils.resolve()
    }
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
};

module.exports = config;
