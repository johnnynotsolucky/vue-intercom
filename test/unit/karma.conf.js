var path = require('path')
var merge = require('webpack-merge')
var baseConfig = require('../../build/webpack.base.conf')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../../')

var webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../../config/env')
    })
  ]
})

delete webpackConfig.entry

webpackConfig.module.rules.unshift({
  test: /\.js$/,
  enforce: 'pre',
  loader: 'isparta-loader',
  include: path.resolve(projectRoot, 'src')
})

webpackConfig.module.rules.some(function(loader, i) {
  if (loader.loader === 'babel-loader') {
    loader.include = path.resolve(projectRoot, 'test/unit')
    return true
  }
})

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }]
    }
  })
}
