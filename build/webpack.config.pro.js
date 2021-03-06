const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const Utils = require('./utils');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ora = require('ora');
const chalk = require('chalk');
const OSS = require('ali-oss');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('./webpack.config.base');
const utils = new Utils('production');
{{#sentry}}
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
{{/sentry}}
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const releaseVersion = Date.parse(new Date());
const CrossOriginPlugin = require('./plugins/CrossOrigin');
const md5 = require('md5');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const env = process.env;
const home = env.HOME;
const params = require('../config');
const projectName = resolvePath('../').split('/').reverse()[0];
const redis = require('redis');
const client = redis.createClient({
  host: '172.17.190.242',
  port: 6379
});
const proConfig = merge(
  config,
  {
    mode: 'production',
    output: {
      filename: `${params.build.directory}/js/[name].[chunkhash:8].js`,
      path: utils.resolve('dist'),
      publicPath: params.build.publicPath,
    },
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new UglifyJSWebpackPlugin({
          cache: true,
          sourceMap: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({})
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
      },
      runtimeChunk: true
    },
    module: {
      rules: [...utils.initLoaders()]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: utils.resolve('index.html'),
        filename: 'index.html',
        path: env.NODE_ENV === 'production' ? params.build.publicPath : '/',
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
        'NODE_ENV': env.NODE_ENV ? `"${env.NODE_ENV}"` : '"development"',
        'releaseVersion': releaseVersion,
        'publicPath': `'${params.build.publicPath}'`
      }),
      new CopyWebpackPlugin([{
        from: utils.resolve('static'),
        to: utils.resolve(`dist/${params.build.directory}`)
      }])
    ]
  }
);
{{#sentry}}
if (env.NODE_ENV === 'production') {
  proConfig.plugins.push(
    new SentryWebpackPlugin({
      include: utils.resolve(`dist/${params.build.directory}/js`),
      ignoreFile: '.sentrycliignore',
      ignore: [utils.resolve('node_modules'), utils.resolve('build')],
      configFile: utils.resolve('sentry.properties'),
      release: releaseVersion,
      sourceMapReference: true,
      urlPrefix: `~/${resolvePath('../').split('/').reverse()[0]}/${params.build.directory}/js`
    })
  );
  proConfig.plugins.push(
    new CrossOriginPlugin()
  )
}
{{/sentry}}
const spinner = ora(`building for ${env.NODE_ENV}...`);
spinner.start();

function resolvePath(rePath = '') {
  return path.resolve(__dirname, rePath);
}

// 生成上传图片的promise
function buildPromise(client, objectName, localFile) {
  return new Promise((resolve, reject) => {
    client.put(objectName, localFile).then(res => {
      resolve(res);
    }).catch(e => {
      reject(e, objectName, localFile);
    });
  });
}

// 获取项目名称
function getItemName() {
  return resolvePath('../').split('/').reverse()[0];
}

// 组装数据
async function upload(dir = 'dist') {
  spinner.start('uploading static sources to oss...');
  // 判断有oss的json文件
  let oss;
  try {
    oss = await getOss();
  } catch(e) {
    console.log(chalk.red(`get oss error: ${e}`));
    process.exit(0);
  }
  const oss = await getOss();
  let options = {};
  options.commit = md5(Date.parse(new Date()));
  options.client = new OSS(JSON.parse(oss));
  try {
    const files = await distinctUploadedPic();
    options.distinctFiles = files.distinctFiles;
    options.newFiles = files.newFiles;
    options.jsonPath = files.jsonPath;
  } catch (e) {
    console.log(chalk.red(e));
    spinner.stop();
    process.exit(0);
  }
  options.name = getItemName();
  await commitFiles(options);
  spinner.stop();
  process.exit(0);
}

// 提交上传
async function commitFiles(options) {
  if (options && options.distinctFiles.length === 0) {
    console.log(chalk.yellow(`no files changed!`));
    return '';
  }
  let tasks = [];
  options.distinctFiles.forEach(file => {
    tasks.push(buildPromise(options.client, `${options.name}${file}`, resolvePath(`../dist${file}`)));
  });
  try {
    await Promise.all(tasks);
    await reWriteFiles(options);
  } catch (e) {
    console.log(chalk.red(e));
    spinner.stop();
    process.exit(0);
  }
  return options;
}

// 重新写入upload.json
async function reWriteFiles(options) {
  try {
    await reSaveFiles(options.newFiles);
  }catch(e) {
    console.log(chalk.red(`rewrite files error:${e}`))
  }
  return '';
}
//读取oss的配置
function getOss() {
  return new Promise((resolve, reject) => {
    client.get('oss', (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}

//获取差异配置
function getDistinctFiles() {
  return new Promise((resolve, reject) => {
    client.get(projectName, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
//储存新的差异文件
function reSaveFiles(data) {
  return new Promise((resolve, reject) => {
    client.set(projectName, data, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
}
// 生成打包文件
function compiler() {
  return new Promise((resolve, reject) => {
    webpack(proConfig, (err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    });
  });
}

// 对比数据，查询修改后的数据
function distinctUploadedPic() {
  return new Promise((resolve, reject) => {
    glob(resolvePath(`../dist/${params.build.directory}/**/*.*`), async (err, files) => {
      if (err) {
        reject(err);
      }
      let distinctFiles = [];
      const newFiles = files.map(item => {
        return item.replace(`${resolvePath('../dist')}`, '');``
      });
      let jsonPath;
      try {
        jsonPath = await getDistinctFiles();
      }catch(e) {
        console.log(chalk.red(`get distinct files error: ${e}`));
        process.exit(0);
      }
      // 判断是否存在upload.json
      if (!jsonPath) {
        // 如果不存在，直接上传图片
        distinctFiles = newFiles;
      } else {
        // 如果存在，对比前后两次的变化数据
        // 获取之前的数据
        const oldFiles = JSON.parse(jsonPath);
        distinctFiles = newFiles.filter(file => {
          return oldFiles.indexOf(file) < 0;
        });
      }
      resolve({
        distinctFiles, newFiles, jsonPath
      });
    });
  });
}


compiler().then(stats => {
  spinner.stop();
  process.stdout.write(stats.toString({
    modules: false,
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n');
  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'));
    process.exit(1);
  }

  console.log(chalk.cyan('  Build complete.\n'));
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ));
  {{#sentry}}
  if (env.NODE_ENV === 'production') {
    require('child_process').execSync(`rm -rf ${utils.resolve('dist')}/${params.build.directory}/js/*.js.map`);
  }
  {{/sentry}}
}).catch(e => {
  throw e;
}).finally(() => {
  // if (env.NODE_ENV === 'production') {
  //   upload();
  // } else {
  //   process.exit(0);
  // }
  process.exit(0);
});

