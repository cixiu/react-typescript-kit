const path = require('path')

module.exports = {
  // 开发环境下的变量
  dev: {
    // 为资源指定公共路径
    assetsPublicPath: '/',
    // 代理
    proxyTable: {
      // '/api': `http://localhost:${serverPort}`,
    },
    // webpack-dev-server配置选择
    host: '0.0.0.0',
    port: 3000,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    // Source Maps
    devtool: 'eval-source-map',
    // 如何需要cssSourceMap,可以设置
    cssSourceMap: false,
    // 打包出错的配合node-notifier库和friendly-errors-webpack-plugin插件提示的icon
    ICON: path.join(__dirname, '../build/error.png'),
  },
  // 打包时的变量
  build: {
    // 路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: '/',
    // 生产环境使用sourceMap 在UglifyJsPlugin中可以配置
    productionSourceMap: true,
    devtool: '#source-map',
  },
}
