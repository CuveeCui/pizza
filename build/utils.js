const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    return Array.prototype.concat([], [...this.loaders]);
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

  /**
   * @desc: js handler
   */
  jsHandler() {
    this.loaders.push(
      {
        test: /\.(js|jsx)$/,
        include: [this.resolve(), this.resolve('node_modules/axios')],
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
  // createLintingRule() {
  //     return {
  //         test: /\.(js|jsx)$/,
  //         loader: 'eslint-loader',
  //         enforce: 'pre',
  //         include: [this.resolve()],
  //         options: {
  //             formatter: require('eslint-friendly-formatter')
  //         }
  //     }
  // }


}

exports = module.exports = Utils;