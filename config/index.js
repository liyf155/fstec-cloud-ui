var path = require('path')
var baseUrl = 'https://gxpta.examtec.cn'
// var baseUrl = 'http://0.0.0.0:9999'
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8888,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    host: '0.0.0.0',
    assetsPublicPath: '/',
    proxyTable: {
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/code': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/code': '/code'
        }
      },
      '/base': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/base': '/base'
        }
      },
      '/gen': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/gen': '/gen'
        }
      },
      '/bigdata': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/bigdata': '/bigdata'
        }
      },
      '/platform': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/platform': '/platform'
        }
      },
      '/checkin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/checkin': '/checkin'
        }
      }
    },
    cssSourceMap: false
  }
}
