"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _globals = require("../utils/globals");
var PropTypes = _interopRequireWildcard(require("prop-types"));
var React = _interopRequireWildcard(require("react"));
var _goongmap = _interopRequireDefault(require("../utils/goongmap"));
var _useMapControl2 = _interopRequireWildcard(require("./use-map-control"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = Object.assign({}, _useMapControl2.mapControlPropTypes, {
  className: PropTypes.string,
  style: PropTypes.object,
  container: PropTypes.object,
  label: PropTypes.string
});
var defaultProps = Object.assign({}, _useMapControl2.mapControlDefaultProps, {
  className: '',
  container: null,
  label: 'Toggle fullscreen'
});
function FullscreenControl(props) {
  var _useMapControl = (0, _useMapControl2["default"])(props),
    context = _useMapControl.context,
    containerRef = _useMapControl.containerRef;
  var _useState = (0, React.useState)(false),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    isFullscreen = _useState2[0],
    setIsFullscreen = _useState2[1];
  var _useState3 = (0, React.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    showButton = _useState4[0],
    setShowButton = _useState4[1];
  var _useState5 = (0, React.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    mapboxFullscreenControl = _useState6[0],
    createMapboxFullscreenControl = _useState6[1];
  (0, React.useEffect)(function () {
    var control = new _goongmap["default"].FullscreenControl();
    createMapboxFullscreenControl(control);
    setShowButton(control._checkFullscreenSupport());
    var onFullscreenChange = function onFullscreenChange() {
      var nextState = !control._fullscreen;
      control._fullscreen = nextState;
      setIsFullscreen(nextState);
    };
    _globals.document.addEventListener(control._fullscreenchange, onFullscreenChange);
    return function () {
      _globals.document.removeEventListener(control._fullscreenchange, onFullscreenChange);
    };
  }, []);
  var onClickFullscreen = function onClickFullscreen() {
    if (mapboxFullscreenControl) {
      mapboxFullscreenControl._container = props.container || context.container;
      mapboxFullscreenControl._onClickFullscreen();
    }
  };
  var style = (0, React.useMemo)(function () {
    return _objectSpread({
      position: 'absolute'
    }, props.style);
  }, [props.style]);
  if (!showButton) {
    return null;
  }
  var className = props.className,
    label = props.label;
  var type = isFullscreen ? 'shrink' : 'fullscreen';
  return React.createElement("div", {
    style: style,
    className: className
  }, React.createElement("div", {
    className: "mapboxgl-ctrl mapboxgl-ctrl-group",
    ref: containerRef
  }, React.createElement("button", {
    key: type,
    className: "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(type),
    type: "button",
    title: label,
    onClick: onClickFullscreen
  }, React.createElement("span", {
    className: "mapboxgl-ctrl-icon",
    "aria-hidden": "true"
  }))));
}
FullscreenControl.propTypes = propTypes;
FullscreenControl.defaultProps = defaultProps;
var _default = React.memo(FullscreenControl);
exports["default"] = _default;
//# sourceMappingURL=fullscreen-control.js.map