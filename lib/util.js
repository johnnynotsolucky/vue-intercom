"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var callIf = exports.callIf = function callIf(a, f) {
  return a && f();
};

var assert = exports.assert = function assert(condition, msg) {
  return callIf(!condition, function () {
    throw new Error("[vue-intercom] " + msg);
  });
};

var is = exports.is = function is(t, o) {
  return o instanceof t || o !== null && o !== undefined && o.constructor === t;
};

var mapInstanceToProps = exports.mapInstanceToProps = function mapInstanceToProps(vm, props) {
  var o = {};
  props.forEach(function (p) {
    return o[p] = { get: function get() {
        return vm[p];
      } };
  });
  return o;
};