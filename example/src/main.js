import Vue from 'vue'
import App from './App.vue'
import VueIntercom from '../../src'

Vue.use(VueIntercom, { appId: process.env.INTERCOM_ID })
console.log(process.env.INTERCOM_ID)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  template: '<app />',
  components: { App }
})
