const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('../config');
class Utils {
  /**
   * @desc: construtor function
   * @param env
   */
  constructor(env = 'development') {
    this.instance = null;
    Utils.env = env;
    this.env = env;
    this.loaders = [];
    this.init();
  }

  /**
   * @desc: initial loaders
   */
  init() {
    this.styleHandler();
    this.jsHandler();
    this.imgHandler();
    this.fontHandler();
  }

  /**
   * @desc: resolve absolute path
   * @param paths - String  default src
   * @returns String: absolute path
   */
  resolve(paths = 'src') {
    return path.resolve(__dirname, '../', paths);
  }

  /**
   * @desc: total loaders handler
   */
  initLoaders() {
    let eslint = [];
    eslint.push(this.createLintingRule());
    return Array.prototype.concat(eslint, [...this.loaders]);
  }

  /**
   * @desc: style handle
   */
  styleHandler() {
    [/\.sass$/, /\.scss$/, /\.css$/].forEach(style => {
      let loader = [
        this.env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
        Utils.css(),
        Utils.postCss()
      ];
      if (!style.test('.css')) loader.push('sass-loader');
      this.loaders.push(
        {
          test: style,
          loader,
          sideEffects: true
        }
      )
    })
  }
  /*
   * font handler
   */
  fontHandler() {
    this.loaders.push({
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: `${process.env.NODE_ENV === 'production' ? config.build.directory : config.dev.directory}/fonts/[name].[hash:7].[ext]`
        }
      })
  }
  /**
   * @desc: js handler
   */
  jsHandler() {
    this.loaders.push(
      {
        test: /\.(js|jsx)$/,
        include: [this.resolve(), this.resolve('node_modules/axios/index.js')],
        use:
          {
            loader: require.resolve('babel-loader'),
            options: {
              compact: true
            }
          }

      }
    )
  }

  /**
   * @desc: img handler
   */
  imgHandler() {
    this.loaders.push({
      test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      }
    })
  }

  /**
   * @desc：postcss options
   */
  static postCss() {
    return {
      loader: require.resolve('postcss-loader'),
      options: {
        indent: 'postcss',
        plugins: [
          require('postcss-flexbugs-fixes'),
          require('autoprefixer')({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9',
            ],
            flexbox: 'no-2009'
          })
        ],
        sourceMap: true
      }
    }
  }

  /**
   * @desc: css options
   */
  static css() {
    return {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        minimize: true,
        sourceMap: true,
      }
    }
  }
  /**
   * @desc: eslint
   */
  createLintingRule() {
      return {
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [this.resolve()],
          options: {
              formatter: require('eslint-friendly-formatter'),
              fix: process.env.NODE_ENV === 'production' ? true : false
          }
      }
  }
}

exports = module.exports = Utils;