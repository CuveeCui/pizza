/**
 * @desc: 为打包好的script，添加crossorigin，解决引用CDN跨域，sentry监听不了onerror事件
 * @param:
 * @return
 * @example: plugins: [ new CrossOriginPlugin() ]
 */
class CrossOriginPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'add-cross-origin',
      (compilation) => {
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
          'add-cross-origin-content',
          (stat) => {
            stat.body.forEach(item => {
              item.attributes.crossorigin = 'anonymous';
            });
          });
      });
  }
}

exports = module.exports = CrossOriginPlugin;