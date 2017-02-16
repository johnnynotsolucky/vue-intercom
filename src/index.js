/* globals window, document */
const assert = (condition, msg) => {
  if (!condition) throw new Error(`[vue-intercom] ${msg}`)
}

const toArray = (o, f) => {
  const arr = []
  const r = typeof f === 'function' ? f() : true
  if (o && r) {
    arr.push(o)
  }
  return arr
}

let Vue
const init = ({ appId }) => {
  assert(Vue, 'call Vue.use(VueIntercom) before creating an instance')
  const vm = new Vue({
    data () {
      return {
        ready: false,
        visible: false,
        unreadCount: 0
      }
    }
  })

  const intercom = { _vm: vm }

  Object.defineProperties(intercom, {
    ready: {
      get: () => vm.ready
    },
    visible: {
      get: () => vm.visible
    },
    unreadCount: {
      get: () => vm.unreadCount
    }
  })

  intercom._init = () => {
    vm.ready = true
    window.Intercom('onHide', () => (vm.visible = false))
    window.Intercom('onShow', () => (vm.visible = true))
    window.Intercom('onUnreadCountChange', unreadCount => (vm.unreadCount = unreadCount))
  }
  intercom.boot = (options) => {
    const opts = options || {}
    if (!opts.app_id) {
      opts.app_id = appId
    }
    window.Intercom('boot', opts)
  }
  intercom.shutdown = () => {
    window.Intercom('shutdown')
  }
  intercom.update = (options) => {
    window.Intercom('update', ...toArray(options))
  }
  intercom.show = () => {
    window.Intercom('show')
  }
  intercom.hide = () => {
    window.Intercom('hide')
  }
  intercom.showMessages = () => {
    window.Intercom('showMessages')
  }
  intercom.showNewMessage = (content) => {
    const isString = () => typeof content === 'string'
    window.Intercom('showNewMessage', ...toArray(content, isString))
  }
  intercom.trackEvent = (name, metadata) => {
    const args = [name].concat(toArray(metadata))
    window.Intercom('trackEvent', ...args)
  }
  intercom.getVisitorId = () => window.Intercom('getVisitorId')

  return intercom
}

let installed

init.install = function install (_Vue, { appId }) {
  assert(!Vue, 'already installed.')
  Vue = _Vue
  const vueIntercom = init({ appId })
  Vue.mixin({
    created () {
      if (!installed) {
        init.loadScript(appId, () => {
          this.$intercom._init()
        })
        installed = true
      }
    }
  })
  Object.defineProperty(Vue.prototype, '$intercom', {
    get: () => vueIntercom
  })
}

init.loadScript = function loadScript (appId, done) {
  const script = document.createElement('script')
  script.src = `https://widget.intercom.io/widget/${appId}`
  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(script, firstScript)
  script.onload = done
}

export default init
