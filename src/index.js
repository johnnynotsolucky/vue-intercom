/* globals window, document */
const assert = (condition, msg) => {
  if (!condition) throw new Error(`[vue-intercom] ${msg}`);
};

let Vue;

class VueIntercom {
  constructor({ appId }) {
    assert(Vue, 'call Vue.use(VueIntercom) before creating an instance');
    this._appId = appId;
    this._vm = new Vue({
      data() {
        return {
          ready: false,
          visible: false,
          unreadCount: 0,
        };
      },
    });
  }
  _init() {
    this._vm.ready = true;
    window.Intercom('onHide', () => (this._vm.visible = false));
    window.Intercom('onShow', () => (this._vm.visible = true));
    window.Intercom('onUnreadCountChange', (unreadCount) => {
      this._vm.unreadCount = unreadCount;
    });
  }

  get ready() {
    return this._vm.ready;
  }

  get visible() {
    return this._vm.visible;
  }

  get unreadCount() {
    return this._vm.unreadCount;
  }

  boot(options) {
    const opts = options || {};
    if (!opts.app_id) {
      opts.app_id = this._appId;
    }
    window.Intercom.call(this, 'boot', opts);
  }

  shutdown() {
    window.Intercom.call(this, 'shutdown');
  }

  update(options) {
    const args = [];
    if (options) {
      args.push(options);
    }
    window.Intercom.call(this, 'update', ...args);
  }

  show() {
    window.Intercom.call(this, 'show');
  }

  hide() {
    window.Intercom.call(this, 'hide');
  }

  showMessages() {
    window.Intercom.call(this, 'showMessages');
  }

  showNewMessage(content) {
    const args = [];
    if (content && typeof content === 'string') {
      args.push(content);
    }
    window.Intercom.call(this, 'showNewMessage', ...args);
  }

  trackEvent(name, metadata) {
    const args = [name];
    if (metadata) {
      args.push(metadata);
    }
    window.Intercom.call(this, 'trackEvent', ...args);
  }

  getVisitorId() {
    return window.Intercom.call(this, 'getVisitorId');
  }
}

let installed;

const install = function install(_Vue, { appId }) {
  assert(!Vue, 'already installed.');
  Vue = _Vue;
  const vueIntercom = new VueIntercom({ appId });
  Vue.mixin({
    beforeCreate() {
      if (!this.$options._intercom) {
        this._intercom = vueIntercom;
      }
    },
    created() {
      if (!installed) {
        install.loadScript(appId, () => {
          this.$intercom._init();
        });
        installed = true;
      }
    },
  });
  Object.defineProperty(Vue.prototype, '$intercom', {
    get() { return this.$root._intercom; },
  });
};

install.loadScript = function loadScript(appId, done) {
  const script = document.createElement('script');
  script.src = `https://widget.intercom.io/widget/${appId}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = done;
};

export default {
  install,
};
