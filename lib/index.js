'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = require('./util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Vue = void 0;
var init = function init(_ref) {
  var appId = _ref.appId;

  (0, _util.assert)(Vue, 'call Vue.use(VueIntercom) before creating an instance');

  var vm = new Vue({
    data: function data() {
      return {
        ready: false,
        visible: false,
        unreadCount: 0
      };
    }
  });

  var queued = [];

  var callIntercom = function callIntercom() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var intercomAvailable = window && window.Intercom && typeof window.Intercom === 'function';
    console.log(intercomAvailable, _typeof(window.Intercom));
    var f = function f() {
      var _window;

      console.log('calling f');
      (_window = window).Intercom.apply(_window, args);
    };
    return intercomAvailable ? f() : queued.push(f);
  };

  var intercom = { _vm: vm };

  Object.defineProperties(intercom, (0, _util.mapInstanceToProps)(vm, ['ready', 'visible', 'unreadCount']));

  intercom._init = function () {
    vm.ready = true;

    queued.forEach(function (f) {
      return f();
    });

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
  intercom.boot = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { app_id: appId };
    return callIntercom('boot', options);
  };
  intercom.shutdown = function () {
    return callIntercom('shutdown');
  };
  intercom.update = function () {
    for (var _len2 = arguments.length, options = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      options[_key2] = arguments[_key2];
    }

    return callIntercom.apply(undefined, ['update'].concat(options));
  };
  intercom.show = function () {
    return callIntercom('show');
  };
  intercom.hide = function () {
    return callIntercom('hide');
  };
  intercom.showMessages = function () {
    return callIntercom('showMessages');
  };
  intercom.showNewMessage = function (content) {
    return callIntercom.apply(undefined, ['showNewMessage'].concat(_toConsumableArray((0, _util.is)(String, content) ? [content] : [])));
  };
  intercom.trackEvent = function (name) {
    for (var _len3 = arguments.length, metadata = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      metadata[_key3 - 1] = arguments[_key3];
    }

    return callIntercom.apply(undefined, ['trackEvent'].concat([name].concat(metadata)));
  };
  intercom.getVisitorId = function () {
    return callIntercom('getVisitorId');
  };

  return intercom;
};

var installed = void 0;

init.install = function install(_Vue, _ref2) {
  var appId = _ref2.appId;

  (0, _util.assert)(!Vue, 'already installed.');
  Vue = _Vue;
  var vueIntercom = init({ appId: appId });
  Vue.mixin({
    created: function created() {
      var _this = this;

      (0, _util.callIf)(!installed, function () {
        init.loadScript(appId, function (x, y) {
          return _this.$intercom._init();
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