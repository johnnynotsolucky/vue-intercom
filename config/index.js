var path = require('path')

module.exports = {
  bundle: {
    env: require('./env'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: '/'
  }
}
