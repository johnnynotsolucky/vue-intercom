'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var callIf = function callIf(a, f) {
  return a && f();
};

var assert = function assert(condition, msg) {
  return callIf(!condition, function () {
    throw new Error('[vue-intercom] ' + msg);
  });
};

var toArray = function toArray(o, f) {
  var arr = [];
  var r = typeof f === 'function' ? f() : true;
  callIf(o && r, function () {
    return arr.push(o);
  });
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

  var callIntercom = function callIntercom() {
    var _window;

    var intercomAvailable = window && window.Intercom && typeof window.Intercom === 'function';
    return intercomAvailable && (_window = window).Intercom.apply(_window, arguments);
  };

  intercom._init = function () {
    vm.ready = true;
    callIntercom('onHide', function () {
      return vm.visible = false;
    });
    callIntercom('onShow', function () {
      return vm.visible = true;
    });
    callIntercom('onUnreadCountChange', function (unreadCount) {
      return vm.unreadCount = unreadCount;
    });
  };
  intercom.boot = function (options) {
    var opts = options || {};
    callIf(!opts.app_id, function () {
      return opts.app_id = appId;
    });
    callIntercom('boot', opts);
  };
  intercom.shutdown = function () {
    callIntercom('shutdown');
  };
  intercom.update = function (options) {
    callIntercom.apply(undefined, ['update'].concat(_toConsumableArray(toArray(options))));
  };
  intercom.show = function () {
    callIntercom('show');
  };
  intercom.hide = function () {
    callIntercom('hide');
  };
  intercom.showMessages = function () {
    callIntercom('showMessages');
  };
  intercom.showNewMessage = function (content) {
    var isString = function isString() {
      return typeof content === 'string';
    };
    callIntercom.apply(undefined, ['showNewMessage'].concat(_toConsumableArray(toArray(content, isString))));
  };
  intercom.trackEvent = function (name, metadata) {
    var args = [name].concat(toArray(metadata));
    callIntercom.apply(undefined, ['trackEvent'].concat(_toConsumableArray(args)));
  };
  intercom.getVisitorId = function () {
    return callIntercom('getVisitorId');
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

      callIf(!installed, function () {
        init.loadScript(appId, function () {
          _this.$intercom._init();
        });
        installed = true;
      });
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