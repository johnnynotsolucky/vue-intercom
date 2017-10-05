/* eslint-disable no-extend-native */
import Vue from 'vue'
import VueIntercom from '../../src/index'

window.Intercom = () => {
  /* noOp */
}
VueIntercom.loadScript = (appId, done) => setTimeout(done, 25)
Vue.use(VueIntercom, { appId: 'foobar' })

Function.prototype.bind = require('function-bind')
require('es6-promise').polyfill()

const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

const srcContext = require.context('../../src', true, /^.*\.js$/)
srcContext.keys().forEach(srcContext)
