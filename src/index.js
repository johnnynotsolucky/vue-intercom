/* globals window, document */
import { callIf, assert, is, mapInstanceToProps } from './util'

let Vue
const init = ({ appId }) => {
  assert(Vue, 'call Vue.use(VueIntercom) before creating an instance')

  const vm = new Vue({
    data() {
      return {
        ready: false,
        visible: false,
        unreadCount: 0
      }
    }
  })

  const callIntercom = (...args) => window.Intercom(...args)

  const intercom = { _vm: vm }

  Object.defineProperties(
    intercom,
    mapInstanceToProps(vm, ['ready', 'visible', 'unreadCount'])
  )

  intercom._call = callIntercom
  intercom._init = () => {
    vm.ready = true

    callIntercom('onHide', () => (vm.visible = false))
    callIntercom('onShow', () => (vm.visible = true))
    callIntercom(
      'onUnreadCountChange',
      unreadCount => (vm.unreadCount = unreadCount)
    )
  }
  intercom.boot = (options = { app_id: appId }) => {
    callIf(!options.app_id, () => (options.app_id = appId))
    callIntercom('boot', options)
  }
  intercom.shutdown = () => callIntercom('shutdown')
  intercom.update = (...options) => callIntercom('update', ...options)
  intercom.show = () => callIntercom('show')
  intercom.hide = () => callIntercom('hide')
  intercom.showMessages = () => callIntercom('showMessages')
  intercom.showNewMessage = content =>
    callIntercom('showNewMessage', ...(is(String, content) ? [content] : []))
  intercom.trackEvent = (name, ...metadata) =>
    callIntercom('trackEvent', ...[name, ...metadata])
  intercom.getVisitorId = () => callIntercom('getVisitorId')

  return intercom
}

let installed

init.install = function install(_Vue, { appId }) {
  assert(!Vue, 'already installed.')
  Vue = _Vue
  const vueIntercom = init({ appId })
  Vue.mixin({
    mounted() {
      callIf(!installed, () => {
        if (typeof window.Intercom === 'function') {
          this.$intercom._init()
          this.$intercom._call('reattach_activator')
          this.$intercom.update()
        } else {
          const placeholder = (...args) => placeholder.c(args)
          placeholder.q = []
          placeholder.c = args => placeholder.q.push(args)
          window.Intercom = placeholder
          const loaded = () => init.loadScript(appId, () => this.$intercom._init())
          if (document.readyState === 'complete') {
            loaded()
          } else if (window.attachEvent) {
            window.attachEvent('onload', loaded)
          } else {
            window.addEventListener('load', loaded, false)
          }
        }
        installed = true
      })
    }
  })
  Object.defineProperty(Vue.prototype, '$intercom', {
    get: () => vueIntercom
  })
}

init.loadScript = function loadScript(appId, done) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://widget.intercom.io/widget/${appId}`
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(script, firstScript)
  script.onload = done
}

export default init
