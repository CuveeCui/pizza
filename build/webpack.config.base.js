const Utils = require('./utils');
const utils = new Utils();
const config = {
  entry: {
    main: utils.resolve('src/main')
  },
  output: {
    path: utils.resolve('dist'),
    filename: 'static/js/[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.scss', '.css'],
    alias: {
      '@': utils.resolve(),
      'api': utils.resolve('src/api'),
      'components': utils.resolve('src/components'),
      'pages': utils.resolve('src/pages'),
      'router': utils.resolve('src/router'),
      'utils': utils.resolve('src/utils'),
      'public': utils.resolve('src/public')
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
