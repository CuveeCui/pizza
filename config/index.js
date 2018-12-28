const { resolve } = require('path');
let env = process.env;
const argvs = process.argv;
if (argvs.length <= 2) {
  env.NODE_ENV = 'development';
} else {
  env.NODE_ENV = argvs[argvs.length - 1].indexOf('pro') >= 0 ? 'production' : argvs[argvs.length - 1];
}
module.exports = {
  dev: {
    // 本地服务端口号
    port: 5000,
    // 本地服务静态资源地址
    publicPath: '/',
    // 本地服务所有静态资源的上层目录
    directory: 'static',
    // 代理配置
    proxy: {
      '/admin': {
        target: 'https://www.xiguacity.cn',
        changeOrigin: true,
        secure: false
      }
    },
    // 是否打开浏览器
    open: false,
    // 本地服务地址
    host: '127.0.0.1',
    // 开发和测试的eslint规则
    rules: {
      'semi': ['error', 'always'],
      'spaced-comment': 'off',
      'eol-last': 'off',
      'space-before-function-paren': 'off',
      'padded-blocks': 'off',
      'no-useless-constructor': 'off',
      'no-multiple-empty-lines': 'off',
      'object-curly-spacing': 'off',
      'max-len': ['error', { 'code': 120 }],
      'eqeqeq': 'error'
    }
  },
  build: {
    // 打包后静态资源引用的绝对地址
    publicPath: env.NODE_ENV === 'production'
                  ? `/${resolve(__dirname, '../').split('/').reverse()[0]}/`
                  : '/',
    // 打包后静态资源的上层目录
    directory: 'static',
    // 打包的eslint规则
    rules: {
      'semi': ['error', 'always'],
      'spaced-comment': 'off',
      'eol-last': 'off',
      'space-before-function-paren': 'off',
      'padded-blocks': 'off',
      'no-useless-constructor': 'off',
      'no-multiple-empty-lines': 'off',
      'object-curly-spacing': 'off',
      'max-len': ['error', { 'code': 120 }],
      'eqeqeq': 'error',
      'no-console': 'error'
    }
  }
}