/* globals window, document */
const callIf = (a, f) => a && f()

const assert = (condition, msg) => callIf(!condition, () => {
  throw new Error(`[vue-intercom] ${msg}`)
})

const toArray = (o, f) => {
  const arr = []
  const r = typeof f === 'function' ? f() : true
  callIf(o && r, () => arr.push(o))
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

  const callIntercom = (...args) => {
    const intercomAvailable = window && window.Intercom && typeof window.Intercom === 'function'
    return intercomAvailable && window.Intercom(...args)
  }

  intercom._init = () => {
    vm.ready = true
    callIntercom('onHide', () => (vm.visible = false))
    callIntercom('onShow', () => (vm.visible = true))
    callIntercom('onUnreadCountChange', unreadCount => (vm.unreadCount = unreadCount))
  }
  intercom.boot = (options) => {
    const opts = options || {}
    callIf(!opts.app_id, () => (opts.app_id = appId))
    callIntercom('boot', opts)
  }
  intercom.shutdown = () => {
    callIntercom('shutdown')
  }
  intercom.update = (options) => {
    callIntercom('update', ...toArray(options))
  }
  intercom.show = () => {
    callIntercom('show')
  }
  intercom.hide = () => {
    callIntercom('hide')
  }
  intercom.showMessages = () => {
    callIntercom('showMessages')
  }
  intercom.showNewMessage = (content) => {
    const isString = () => typeof content === 'string'
    callIntercom('showNewMessage', ...toArray(content, isString))
  }
  intercom.trackEvent = (name, metadata) => {
    const args = [name].concat(toArray(metadata))
    callIntercom('trackEvent', ...args)
  }
  intercom.getVisitorId = () => callIntercom('getVisitorId')

  return intercom
}

let installed

init.install = function install (_Vue, { appId }) {
  assert(!Vue, 'already installed.')
  Vue = _Vue
  const vueIntercom = init({ appId })
  Vue.mixin({
    created () {
      callIf(!installed, () => {
        init.loadScript(appId, () => {
          this.$intercom._init()
        })
        installed = true
      })
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
