'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var assert = function assert(condition, msg) {
  if (!condition) throw new Error('[vue-intercom] ' + msg);
};

var toArray = function toArray(o, f) {
  var arr = [];
  var r = typeof f === 'function' ? f() : true;
  if (o && r) {
    arr.push(o);
  }
  return arr;
};

var Vue = void 0;
var init = function init(_ref) {
  var appId = _ref.appId;

  assert(Vue, 'call Vue.use(VueIntercom) before creating an instance');
  var vm = new Vue({
    data: function data() {
      return {
        ready: false,
        visible: false,
        unreadCount: 0
      };
    }
  });

  var intercom = { _vm: vm };

  Object.defineProperties(intercom, {
    ready: {
      get: function get() {
        return vm.ready;
      }
    },
    visible: {
      get: function get() {
        return vm.visible;
      }
    },
    unreadCount: {
      get: function get() {
        return vm.unreadCount;
      }
    }
  });

  intercom._init = function () {
    vm.ready = true;
    window.Intercom('onHide', function () {
      return vm.visible = false;
    });
    window.Intercom('onShow', function () {
      return vm.visible = true;
    });
    window.Intercom('onUnreadCountChange', function (unreadCount) {
      return vm.unreadCount = unreadCount;
    });
  };
  intercom.boot = function (options) {
    var opts = options || {};
    if (!opts.app_id) {
      opts.app_id = appId;
    }
    window.Intercom('boot', opts);
  };
  intercom.shutdown = function () {
    window.Intercom('shutdown');
  };
  intercom.update = function (options) {
    var _window;

    (_window = window).Intercom.apply(_window, ['update'].concat(_toConsumableArray(toArray(options))));
  };
  intercom.show = function () {
    window.Intercom('show');
  };
  intercom.hide = function () {
    window.Intercom('hide');
  };
  intercom.showMessages = function () {
    window.Intercom('showMessages');
  };
  intercom.showNewMessage = function (content) {
    var _window2;

    var isString = function isString() {
      return typeof content === 'string';
    };
    (_window2 = window).Intercom.apply(_window2, ['showNewMessage'].concat(_toConsumableArray(toArray(content, isString))));
  };
  intercom.trackEvent = function (name, metadata) {
    var _window3;

    var args = [name].concat(toArray(metadata));
    (_window3 = window).Intercom.apply(_window3, ['trackEvent'].concat(_toConsumableArray(args)));
  };
  intercom.getVisitorId = function () {
    return window.Intercom('getVisitorId');
  };

  return intercom;
};

var installed = void 0;

init.install = function install(_Vue, _ref2) {
  var appId = _ref2.appId;

  assert(!Vue, 'already installed.');
  Vue = _Vue;
  var vueIntercom = init({ appId: appId });
  Vue.mixin({
    created: function created() {
      var _this = this;

      if (!installed) {
        init.loadScript(appId, function () {
          _this.$intercom._init();
        });
        installed = true;
      }
    }
  });
  Object.defineProperty(Vue.prototype, '$intercom', {
    get: function get() {
      return vueIntercom;
    }
  });
};

init.loadScript = function loadScript(appId, done) {
  var script = document.createElement('script');
  script.src = 'https://widget.intercom.io/widget/' + appId;
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  script.onload = done;
};

exports.default = init;