"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _react = require("react");
var PropTypes = _interopRequireWildcard(require("prop-types"));
var _mapContext = _interopRequireDefault(require("./map-context"));
var _assert = _interopRequireDefault(require("../utils/assert"));
var _deepEqual = _interopRequireDefault(require("../utils/deep-equal"));
var _excluded = ["layout", "paint", "filter", "minzoom", "maxzoom", "beforeId"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var LAYER_TYPES = ['fill', 'line', 'symbol', 'circle', 'fill-extrusion', 'raster', 'background', 'heatmap', 'hillshade', 'sky'];
var propTypes = {
  type: PropTypes.oneOf(LAYER_TYPES).isRequired,
  id: PropTypes.string,
  source: PropTypes.string,
  beforeId: PropTypes.string
};
function diffLayerStyles(map, id, props, prevProps) {
  var _props$layout = props.layout,
    layout = _props$layout === void 0 ? {} : _props$layout,
    _props$paint = props.paint,
    paint = _props$paint === void 0 ? {} : _props$paint,
    filter = props.filter,
    minzoom = props.minzoom,
    maxzoom = props.maxzoom,
    beforeId = props.beforeId,
    otherProps = (0, _objectWithoutProperties2["default"])(props, _excluded);
  if (beforeId !== prevProps.beforeId) {
    map.moveLayer(id, beforeId);
  }
  if (layout !== prevProps.layout) {
    var prevLayout = prevProps.layout || {};
    for (var key in layout) {
      if (!(0, _deepEqual["default"])(layout[key], prevLayout[key])) {
        map.setLayoutProperty(id, key, layout[key]);
      }
    }
    for (var _key in prevLayout) {
      if (!layout.hasOwnProperty(_key)) {
        map.setLayoutProperty(id, _key, undefined);
      }
    }
  }
  if (paint !== prevProps.paint) {
    var prevPaint = prevProps.paint || {};
    for (var _key2 in paint) {
      if (!(0, _deepEqual["default"])(paint[_key2], prevPaint[_key2])) {
        map.setPaintProperty(id, _key2, paint[_key2]);
      }
    }
    for (var _key3 in prevPaint) {
      if (!paint.hasOwnProperty(_key3)) {
        map.setPaintProperty(id, _key3, undefined);
      }
    }
  }
  if (!(0, _deepEqual["default"])(filter, prevProps.filter)) {
    map.setFilter(id, filter);
  }
  if (minzoom !== prevProps.minzoom || maxzoom !== prevProps.maxzoom) {
    map.setLayerZoomRange(id, minzoom, maxzoom);
  }
  for (var _key4 in otherProps) {
    if (!(0, _deepEqual["default"])(otherProps[_key4], prevProps[_key4])) {
      map.setLayerProperty(id, _key4, otherProps[_key4]);
    }
  }
}
function createLayer(map, id, props) {
  if (map.style && map.style._loaded) {
    var options = _objectSpread(_objectSpread({}, props), {}, {
      id: id
    });
    delete options.beforeId;
    map.addLayer(options, props.beforeId);
  }
}
function updateLayer(map, id, props, prevProps) {
  (0, _assert["default"])(props.id === prevProps.id, 'layer id changed');
  (0, _assert["default"])(props.type === prevProps.type, 'layer type changed');
  try {
    diffLayerStyles(map, id, props, prevProps);
  } catch (error) {
    console.warn(error);
  }
}
var layerCounter = 0;
function Layer(props) {
  var context = (0, _react.useContext)(_mapContext["default"]);
  var propsRef = (0, _react.useRef)({
    id: props.id,
    type: props.type
  });
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    setStyleLoaded = _useState2[1];
  var id = (0, _react.useMemo)(function () {
    return props.id || "jsx-layer-".concat(layerCounter++);
  }, []);
  var map = context.map;
  (0, _react.useEffect)(function () {
    if (map) {
      var forceUpdate = function forceUpdate() {
        return setStyleLoaded(function (version) {
          return version + 1;
        });
      };
      map.on('styledata', forceUpdate);
      return function () {
        map.off('styledata', forceUpdate);
        if (map.style && map.style._loaded) {
          map.removeLayer(id);
        }
      };
    }
    return undefined;
  }, [map]);
  var layer = map && map.style && map.getLayer(id);
  if (layer) {
    updateLayer(map, id, props, propsRef.current);
  } else {
    createLayer(map, id, props);
  }
  propsRef.current = props;
  return null;
}
Layer.propTypes = propTypes;
var _default = Layer;
exports["default"] = _default;
//# sourceMappingURL=layer.js.map