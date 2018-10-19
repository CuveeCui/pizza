const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const Utils = require('./utils');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ora = require('ora');
const chalk = require('chalk');
const config = require('./webpack.config.base');
const utils = new Utils('production');
{{#sentry}}
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
{{/sentry}}
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const params = require('../config');
const proConfig = merge(
  config,
  {
    mode: 'production',
    output: {
      filename: `${params.build.directory}/js/[name].[chunkhash:8].js`,
      path: utils.resolve('dist'),
      publicPath: params.build.publicPath
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJSWebpackPlugin({
          cache: true,
          sourceMap: true,
          parallel: true
        })
      ],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10
          },
          common: {
            name: 'commons',
            chunks: 'all',
            minChunks: 3
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [...utils.initLoaders()]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: utils.resolve('index.html'),
        filename: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true
      }),
      new MiniCssExtractPlugin({
        filename: `${params.build.directory}/css/[name].[contenthash:8].css`
      }),
      new CleanWebpackPlugin(['dist'], {
        root: utils.resolve('./')
      }),
      new webpack.DefinePlugin({
        'NODE_ENV': process.env.NODE_ENV ? `"${process.env.NODE_ENV}"` : "'production'"
      }),
      new CopyWebpackPlugin([{
        from: utils.resolve('static'),
        to: utils.resolve('dist/static')
      }]),
      {{#sentry}}
      new SentryWebpackPlugin({
        include: utils.resolve('dist/static/js'),
        ignoreFile: '.sentrycliignore',
        ignore: [utils.resolve('node_modules'), utils.resolve('build')],
        configFile: utils.resolve('sentry.properties'),
        release: 'xigua_users',
        sourceMapReference: true
      })
      {{/sentry}}
    ]
  }
)
const spinner = ora('building for production...');
spinner.start();

const compiler = webpack(proConfig, (err, stats) => {
  spinner.stop();
  if (err) throw err;
  process.stdout.write(stats.toString({
    modules: false,
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n');
  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('  Build complete.\n'));
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ));
  //require('child_process').exec(`rm -rf ${utils.resolve('dist')}/js/*.js.map`);
});
