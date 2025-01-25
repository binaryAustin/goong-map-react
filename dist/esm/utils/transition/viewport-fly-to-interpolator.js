import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
import assert from '../assert';
import TransitionInterpolator from './transition-interpolator';
import { flyToViewport, getFlyToDuration } from 'viewport-mercator-project';
import { isValid, getEndValueByShortestPath } from './transition-utils';
import { lerp } from '../math-utils';
var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
var REQUIRED_PROPS = ['latitude', 'longitude', 'zoom', 'width', 'height'];
var LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];
var DEFAULT_OPTS = {
  speed: 1.2,
  curve: 1.414
};
var ViewportFlyToInterpolator = function (_TransitionInterpolat) {
  _inherits(ViewportFlyToInterpolator, _TransitionInterpolat);
  var _super = _createSuper(ViewportFlyToInterpolator);
  function ViewportFlyToInterpolator() {
    var _this;
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, ViewportFlyToInterpolator);
    _this = _super.call(this);
    _defineProperty(_assertThisInitialized(_this), "propNames", VIEWPORT_TRANSITION_PROPS);
    _this.props = Object.assign({}, DEFAULT_OPTS, props);
    return _this;
  }
  _createClass(ViewportFlyToInterpolator, [{
    key: "initializeProps",
    value: function initializeProps(startProps, endProps) {
      var startViewportProps = {};
      var endViewportProps = {};
      for (var _i = 0, _REQUIRED_PROPS = REQUIRED_PROPS; _i < _REQUIRED_PROPS.length; _i++) {
        var key = _REQUIRED_PROPS[_i];
        var startValue = startProps[key];
        var endValue = endProps[key];
        assert(isValid(startValue) && isValid(endValue), "".concat(key, " must be supplied for transition"));
        startViewportProps[key] = startValue;
        endViewportProps[key] = getEndValueByShortestPath(key, startValue, endValue);
      }
      for (var _i2 = 0, _LINEARLY_INTERPOLATE = LINEARLY_INTERPOLATED_PROPS; _i2 < _LINEARLY_INTERPOLATE.length; _i2++) {
        var _key = _LINEARLY_INTERPOLATE[_i2];
        var _startValue = startProps[_key] || 0;
        var _endValue = endProps[_key] || 0;
        startViewportProps[_key] = _startValue;
        endViewportProps[_key] = getEndValueByShortestPath(_key, _startValue, _endValue);
      }
      return {
        start: startViewportProps,
        end: endViewportProps
      };
    }
  }, {
    key: "interpolateProps",
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = flyToViewport(startProps, endProps, t, this.props);
      for (var _i3 = 0, _LINEARLY_INTERPOLATE2 = LINEARLY_INTERPOLATED_PROPS; _i3 < _LINEARLY_INTERPOLATE2.length; _i3++) {
        var key = _LINEARLY_INTERPOLATE2[_i3];
        viewport[key] = lerp(startProps[key], endProps[key], t);
      }
      return viewport;
    }
  }, {
    key: "getDuration",
    value: function getDuration(startProps, endProps) {
      var transitionDuration = endProps.transitionDuration;
      if (transitionDuration === 'auto') {
        transitionDuration = getFlyToDuration(startProps, endProps, this.props);
      }
      return transitionDuration;
    }
  }]);
  return ViewportFlyToInterpolator;
}(TransitionInterpolator);
export { ViewportFlyToInterpolator as default };
//# sourceMappingURL=viewport-fly-to-interpolator.js.map