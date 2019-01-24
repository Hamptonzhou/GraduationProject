const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/' :
  '/'

module.exports = {
  // 打包文件输出文件目录
  // outputDir: 'dist'

  //  "baseUrl" option in vue.config.js is deprecated now, please use "publicPath" instead.
  baseUrl: BASE_URL,

  // 是否在保存时使用eslint-loader进行代码规范检查
  lintOnSave: false,

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // webpack配置。
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // 为src目录设置别名='@'
      .set('_c', resolve('src/components'))
  },

  // webpack-dev-server 相关配置
  devServer: {
    // host: '0.0.0.0',
    port: 9601,
  }

}
