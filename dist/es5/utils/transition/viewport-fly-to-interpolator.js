"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _assert = _interopRequireDefault(require("../assert"));
var _transitionInterpolator = _interopRequireDefault(require("./transition-interpolator"));
var _viewportMercatorProject = require("viewport-mercator-project");
var _transitionUtils = require("./transition-utils");
var _mathUtils = require("../math-utils");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
var REQUIRED_PROPS = ['latitude', 'longitude', 'zoom', 'width', 'height'];
var LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];
var DEFAULT_OPTS = {
  speed: 1.2,
  curve: 1.414
};
var ViewportFlyToInterpolator = function (_TransitionInterpolat) {
  (0, _inherits2["default"])(ViewportFlyToInterpolator, _TransitionInterpolat);
  var _super = _createSuper(ViewportFlyToInterpolator);
  function ViewportFlyToInterpolator() {
    var _this;
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2["default"])(this, ViewportFlyToInterpolator);
    _this = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "propNames", VIEWPORT_TRANSITION_PROPS);
    _this.props = Object.assign({}, DEFAULT_OPTS, props);
    return _this;
  }
  (0, _createClass2["default"])(ViewportFlyToInterpolator, [{
    key: "initializeProps",
    value: function initializeProps(startProps, endProps) {
      var startViewportProps = {};
      var endViewportProps = {};
      for (var _i = 0, _REQUIRED_PROPS = REQUIRED_PROPS; _i < _REQUIRED_PROPS.length; _i++) {
        var key = _REQUIRED_PROPS[_i];
        var startValue = startProps[key];
        var endValue = endProps[key];
        (0, _assert["default"])((0, _transitionUtils.isValid)(startValue) && (0, _transitionUtils.isValid)(endValue), "".concat(key, " must be supplied for transition"));
        startViewportProps[key] = startValue;
        endViewportProps[key] = (0, _transitionUtils.getEndValueByShortestPath)(key, startValue, endValue);
      }
      for (var _i2 = 0, _LINEARLY_INTERPOLATE = LINEARLY_INTERPOLATED_PROPS; _i2 < _LINEARLY_INTERPOLATE.length; _i2++) {
        var _key = _LINEARLY_INTERPOLATE[_i2];
        var _startValue = startProps[_key] || 0;
        var _endValue = endProps[_key] || 0;
        startViewportProps[_key] = _startValue;
        endViewportProps[_key] = (0, _transitionUtils.getEndValueByShortestPath)(_key, _startValue, _endValue);
      }
      return {
        start: startViewportProps,
        end: endViewportProps
      };
    }
  }, {
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = (0, _viewportMercatorProject.flyToViewport)(startProps, endProps, t, this.props);
      for (var _i3 = 0, _LINEARLY_INTERPOLATE2 = LINEARLY_INTERPOLATED_PROPS; _i3 < _LINEARLY_INTERPOLATE2.length; _i3++) {
        var key = _LINEARLY_INTERPOLATE2[_i3];
        viewport[key] = (0, _mathUtils.lerp)(startProps[key], endProps[key], t);
      }
      return viewport;
    }
  }, {
    key: "getDuration",
    value: function getDuration(startProps, endProps) {
      var transitionDuration = endProps.transitionDuration;
      if (transitionDuration === 'auto') {
        transitionDuration = (0, _viewportMercatorProject.getFlyToDuration)(startProps, endProps, this.props);
      }
      return transitionDuration;
    }
  }]);
  return ViewportFlyToInterpolator;
}(_transitionInterpolator["default"]);
exports["default"] = ViewportFlyToInterpolator;
//# sourceMappingURL=viewport-fly-to-interpolator.js.map