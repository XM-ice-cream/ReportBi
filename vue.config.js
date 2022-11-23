const path = require('path')

const resolve = dir => path.join(__dirname, dir)
const isProduction = process.env.NODE_ENV === 'production'
const padLeft = num => String(num).padStart(2, '0') // 左侧补零

module.exports = {
  lintOnSave: false,
  // 打包时是否开启hash组合名称
  filenameHashing: true,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  runtimeCompiler: true,
  // webpack基本配置
  configureWebpack: config => {
    const plugins = []
    if (isProduction) {
      // 取消webpack警告的性能提示
      config.performance = {
        hints: 'warning', // 提示类型
        maxEntrypointSize: 1000 * 500, //入口起点的最大体积
        maxAssetSize: 1000 * 500 //生成文件的最大体积
      }
    }
    return {
      plugins
    }
  },
  // webpack细粒度配置
  chainWebpack: config => {
    // 配置版本号
    config.plugin('define').tap(args => {
      args[0]['process.env'].VERSION = (function () {
        const now = new Date()
        return now.getFullYear() + padLeft(now.getMonth() + 1) + padLeft(now.getDate()) + padLeft(now.getHours()) + padLeft(now.getMinutes())
      })()
      return args
    })
    // 配置路径引用
    config.resolve.alias
      .set('@', resolve('src'))
    if (isProduction) {
      // 压缩图片
      config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({
          bypassOnDebug: true
        })
        .end()

      // 配置optimization
      config.optimization.minimizer('terser').tap((args) => {
        // 注释 console.*
        args[0].terserOptions.compress.drop_console = true
        // 移除 debugger
        args[0].terserOptions.compress.drop_debugger = true
        // 移除console.log
        args[0].terserOptions.compress.pure_funcs = ["console.log"]
        // 去掉注释
        args[0].terserOptions.output = {
          comments: false
        }
        return args
      })
    }

  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    //解决流程控制台倒计时组件导致的路由加载失败
    publicPath: '/', // 公共路径 打包后资源可以访问的路径
  },
  //publicPath: './' //解决打包后页面空白
}