const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const chalk = require('chalk');
const config = require('./webpack.config.base');
const Utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const utils = new Utils();
const params = require('../config');

const options = {
  contentBase: utils.resolve('dist'),
  compress: true,
  hot: true,
  host: params.dev.host,
  port: params.dev.port,
  inline: true,
  historyApiFallback: {
    disableDotRule: true
  },
  stats: {
    modules: false,
    entrypoints: false,
    colors: true
  },
  publicPath: params.dev.publicPath,
  proxy: params.dev.proxy,
  open: params.dev.open
};

const mergeConfig = merge(config, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [...utils.initLoaders()]
  },
  devServer: options,
  plugins: [
    new HtmlWebpackPlugin({
      template: utils.resolve('index.html'),
      filename: 'index.html',
      favicon: utils.resolve('static/img/favicon.03f39ec0.ico')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'NODE_ENV': "'development'"
    })
  ]
});
module.exports = mergeConfig;


