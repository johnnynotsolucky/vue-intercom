import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import VueIntercom from '../../src'
import Index from './Index.vue'
import Two from './Two.vue'

Vue.use(VueRouter)
Vue.use(VueIntercom, { appId: process.env.INTERCOM_ID })

const routes = [
  { path: '/', component: Index },
  { path: '/two', component: Two }
]

const router = new VueRouter({ routes })

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  template: '<app />',
  components: { App }
})
