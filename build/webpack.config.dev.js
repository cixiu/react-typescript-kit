const path = require('path')
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')
const autoprefixer = require('autoprefixer')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const config = require('../config')

const resolve = dir => path.join(__dirname, '..', dir)

const PORT = process.env.PORT || config.dev.port
const HOST = process.env.HOST || config.dev.host

module.exports = {
  mode: 'development',
  devtool: config.dev.devtool,
  entry: ['@babel/polyfill', resolve('src/index.tsx')],
  output: {
    path: config.build.assetsRoot,
    filename: 'static/js/[name].js',
    // 如果没有给chunk命名，[name] 是一个自动分配的、可读性很差的id
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.json'],
    alias: {
      '@': resolve('src'),
      '@store': resolve('src/store'),
      '@pages': resolve('src/pages'),
      '@components': resolve('src/components'),
      '@api': resolve('src/api'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: [resolve('node_modules')],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: [resolve('node_modules')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: [
                'react-hot-loader/babel',
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              // ts-loader配合fork-ts-checker-webpack-plugin插件获取完全的类型检查来加快编译的速度
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css',
                  }),
                ],
              }),
              // compilerOptions: {
              //   module: 'es2015'
              // }
            },
          },
        ],
      },
      // 针对antd样式 专门配置css-loader
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      // antd样式不启用css-modules
      {
        test: /\.(css|scss)$/,
        exclude: [/node_modules/],
        use: [
          'style-loader',
          {
            // 使用typings-for-css-modules-loader来解决使用import './xxx.scss'找不到模块的报错问题
            loader: 'typings-for-css-modules-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[folder]__[local]--[hash:base64:5]',
              namedExport: true,
              camelCase: true,
              slient: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/](?!antd)/,
          // chunks: 'all',
          chunks: 'initial', // initial 初始块 | async 按需加载 | all 所有块
          // minChunks: 2,   // 拆分前共享一个模块的最小块数 (default: 1)
          // minSize: 0,     // 块的最小大小 (default: 30000)
          priority: -10,
          reuseExistingChunk: true, // 配置在模块完全匹配时重用已有的块，而不是创建新块。
          enforce: true,
        },
        commons: {
          // chunks: 'async',
          chunks: 'all',
          minChunks: 2,
          // minSize: 0,
          priority: -20,
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      favicon: resolve('favicon.ico'),
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:${PORT}`],
        // notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        notifier.notify({
          title: 'Webpack error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: config.dev.ICON,
        })
      },
    }),
    // 在编译时定义全局常量，开发环境下process.env.NODE_ENV = 'development'
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]),
    // HMR(热更新)后显示正确的模块名字，在开发环境下使用较好
    new webpack.NamedModulesPlugin(),
    // 确保包括错误的资源都不会被emit
    new webpack.NoEmitOnErrorsPlugin(),
    // 以一个单独的进程来运行ts类型检查和lint来加快编译速度，配合ts-loader使用
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: resolve('src'),
      tsconfig: resolve('tsconfig.json'),
      tslint: resolve('tslint.json'),
    }),
  ],
  // 更多webpack-dev-server的详细信息 https://webpack.js.org/configuration/dev-server/
  devServer: {
    host: HOST,
    port: PORT,
    // 启用webpack的Hot Module Replacement(热更替)特性
    hot: true,
    // 启用gzip压缩生成的文件
    compress: true,
    // 服务启动成功后，是否自动打开浏览器
    open: config.dev.autoOpenBrowser,
    // 告诉服务器从哪里提供内容。
    // 默认是当前工作路径 publicPath优先级高于contentBase
    // contentBase: config.build.assetsRoot,
    contentBase: '/',
    // 与output的publicPath保持一致 此路径下的打包文件可在浏览器中访问。默认是'/'
    publicPath: config.dev.assetsPublicPath,
    // 使用HTML5 History API 解决在刷新路由报404的错误
    historyApiFallback: {
      index: '/index.html',
    },
    // 浏览器控制台打印相关的信息，可选的有none, error, warning or info (default).
    // 默认情况下，当reloading，error，HMR的时候都会显示相关信息在控制台
    // 这可能显得有点啰嗦，设置none可以关掉
    clientLogLevel: 'warning',
    // 当webpack编译错误时，在浏览器上加上遮盖层显示错误信息
    overlay: {
      errors: true,
    },
    // 默认在console中(命令行中)显示webpack编译的过程，这个过程在console中过多
    // quiet=true可以隐藏掉编译的过程
    // 配合friendly-errors-webpack-plugin插件，则可以在编译失败的时候在consol中提示
    quiet: true,
    // webpack使用文件监控系统来监控文件改变，
    // 忽略node_modules文件，也不进行轮询
    watchOptions: {
      ignored: /node_modules/,
      poll: config.dev.poll,
    },
    proxy: config.dev.proxyTable,
  },
  // 某些第三方库使用了node原生的变量或者模块，但是在浏览器中并不会使用他们
  // 所以给这些变量或者模块提供一个空的对象，来让这些库正常运行
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}
