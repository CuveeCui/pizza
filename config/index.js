module.exports = {
  dev: {
    port: 5000,
    publicPath: '/',
    directory: 'static',
    proxy: {
      '/admin': {
        target: 'https://www.xiguacity.cn',
        changeOrigin: true,
        secure: false
      }
    },
    open: true,
    host: '127.0.0.1'
  },
  build: {
    publicPath: '/',
    directory: 'static',
  }
}