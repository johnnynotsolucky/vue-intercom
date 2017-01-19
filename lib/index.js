'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = function assert(condition, msg) {
  if (!condition) throw new Error('[vue-intercom] ' + msg);
};

var Vue = void 0;

var VueIntercom = function () {
  function VueIntercom(_ref) {
    var appId = _ref.appId;

    _classCallCheck(this, VueIntercom);

    assert(Vue, 'call Vue.use(VueIntercom) before creating an instance');
    this._appId = appId;
    this._vm = new Vue({
      data: function data() {
        return {
          ready: false,
          visible: false,
          unreadCount: 0
        };
      }
    });
  }

  _createClass(VueIntercom, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      this._vm.ready = true;
      window.Intercom('onHide', function () {
        return _this._vm.visible = false;
      });
      window.Intercom('onShow', function () {
        return _this._vm.visible = true;
      });
      window.Intercom('onUnreadCountChange', function (unreadCount) {
        _this._vm.unreadCount = unreadCount;
      });
    }
  }, {
    key: 'boot',
    value: function boot(options) {
      var opts = options || {};
      if (!opts.app_id) {
        opts.app_id = this._appId;
      }
      window.Intercom.call(this, 'boot', opts);
    }
  }, {
    key: 'shutdown',
    value: function shutdown() {
      window.Intercom.call(this, 'shutdown');
    }
  }, {
    key: 'update',
    value: function update(options) {
      var _window$Intercom;

      var args = [];
      if (options) {
        args.push(options);
      }
      (_window$Intercom = window.Intercom).call.apply(_window$Intercom, [this, 'update'].concat(args));
    }
  }, {
    key: 'show',
    value: function show() {
      window.Intercom.call(this, 'show');
    }
  }, {
    key: 'hide',
    value: function hide() {
      window.Intercom.call(this, 'hide');
    }
  }, {
    key: 'showMessages',
    value: function showMessages() {
      window.Intercom.call(this, 'showMessages');
    }
  }, {
    key: 'showNewMessage',
    value: function showNewMessage(content) {
      var _window$Intercom2;

      var args = [];
      if (content && typeof content === 'string') {
        args.push(content);
      }
      (_window$Intercom2 = window.Intercom).call.apply(_window$Intercom2, [this, 'showNewMessage'].concat(args));
    }
  }, {
    key: 'trackEvent',
    value: function trackEvent(name, metadata) {
      var _window$Intercom3;

      var args = [name];
      if (metadata) {
        args.push(metadata);
      }
      (_window$Intercom3 = window.Intercom).call.apply(_window$Intercom3, [this, 'trackEvent'].concat(args));
    }
  }, {
    key: 'getVisitorId',
    value: function getVisitorId() {
      return window.Intercom.call(this, 'getVisitorId');
    }
  }, {
    key: 'ready',
    get: function get() {
      return this._vm.ready;
    }
  }, {
    key: 'visible',
    get: function get() {
      return this._vm.visible;
    }
  }, {
    key: 'unreadCount',
    get: function get() {
      return this._vm.unreadCount;
    }
  }]);

  return VueIntercom;
}();

var installed = void 0;

var install = function install(_Vue, _ref2) {
  var appId = _ref2.appId;

  assert(!Vue, 'already installed.');
  Vue = _Vue;
  var vueIntercom = new VueIntercom({ appId: appId });
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options._intercom) {
        this._intercom = vueIntercom;
      }
    },
    created: function created() {
      var _this2 = this;

      if (!installed) {
        install.loadScript(appId, function () {
          _this2.$intercom._init();
        });
        installed = true;
      }
    }
  });
  Object.defineProperty(Vue.prototype, '$intercom', {
    get: function get() {
      return this.$root._intercom;
    }
  });
};

install.loadScript = function loadScript(appId, done) {
  var script = document.createElement('script');
  script.src = 'https://widget.intercom.io/widget/' + appId;
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = done;
};

exports.default = {
  install: install
};