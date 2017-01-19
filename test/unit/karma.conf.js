var path = require('path')
var merge = require('webpack-merge')
var baseConfig = require('../../build/webpack.base.conf')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../../')

var webpackConfig = merge(baseConfig, {
  devtool: '#inline-source-map',
  vue: {
    loaders: {
      js: 'isparta'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../../config/env')
    })
  ]
})

delete webpackConfig.entry

webpackConfig.module.preLoaders = webpackConfig.module.preLoaders || []
webpackConfig.module.preLoaders.unshift({
  test: /\.js$/,
  loader: 'isparta',
  include: path.resolve(projectRoot, 'src')
})

webpackConfig.module.loaders.some(function (loader, i) {
  if (loader.loader === 'babel') {
    loader.include = path.resolve(projectRoot, 'test/unit')
    return true
  }
})

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'sinon-chai'],
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
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}
