const path = require('path')
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const config = require('../config')

const resolve = dir => path.join(__dirname, '..', dir)

module.exports = {
  mode: 'production',
  devtool: config.build.devtool,
  entry: ['@babel/polyfill', resolve('src/index.tsx')],
  output: {
    path: config.build.assetsRoot,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
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
          // 'style-loader',
          MiniCssExtractPlugin.loader,
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
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            // 使用typings-for-css-modules-loader来解决使用import './xxx.scss'找不到模块的报错问题
            loader: 'typings-for-css-modules-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[hash:base64:5]',
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
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: config.build.productionSourceMap,
        uglifyOptions: {
          ecma: 8,
          warnings: false,
          output: {
            comments: false,
            beautify: false,
          },
          // toplevel: false,
          // nameCache: null,
          ie8: false,
          // keep_classnames: undefined,
          // keep_fnames: false,
          mangle: true,
        },
      }),
      // 压缩css文件
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: config.build.productionSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
      }),
    ],
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
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
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    // 在编译时定义全局常量，开发环境下process.env.NODE_ENV = 'development'
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    // 以一个单独的进程来运行ts类型检查和lint来加快编译速度，配合ts-loader使用
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: resolve('src'),
      tsconfig: resolve('tsconfig.json'),
      tslint: resolve('tslint.json'),
    }),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]),
    new BundleAnalyzerPlugin(),
  ],
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
