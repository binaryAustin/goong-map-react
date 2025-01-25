"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var React = _interopRequireWildcard(require("react"));
var PropTypes = _interopRequireWildcard(require("prop-types"));
var _draggableControl = _interopRequireWildcard(require("./draggable-control"));
var _crispPixel = require("../utils/crisp-pixel");
var _terrain = require("../utils/terrain");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = Object.assign({}, _draggableControl.draggableControlPropTypes, {
  className: PropTypes.string,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired
});
var defaultProps = Object.assign({}, _draggableControl.draggableControlDefaultProps, {
  className: ''
});
function getPosition(_ref) {
  var props = _ref.props,
    state = _ref.state,
    context = _ref.context;
  var longitude = props.longitude,
    latitude = props.latitude,
    offsetLeft = props.offsetLeft,
    offsetTop = props.offsetTop;
  var dragPos = state.dragPos,
    dragOffset = state.dragOffset;
  var viewport = context.viewport,
    map = context.map;
  if (dragPos && dragOffset) {
    return [dragPos[0] + dragOffset[0], dragPos[1] + dragOffset[1]];
  }
  var altitude = (0, _terrain.getTerrainElevation)(map, {
    longitude: longitude,
    latitude: latitude
  });
  var _viewport$project = viewport.project([longitude, latitude, altitude]),
    _viewport$project2 = (0, _slicedToArray2["default"])(_viewport$project, 2),
    x = _viewport$project2[0],
    y = _viewport$project2[1];
  x += offsetLeft;
  y += offsetTop;
  return [x, y];
}
function Marker() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultProps;
  var thisRef = (0, _draggableControl["default"])(props);
  var state = thisRef.state,
    containerRef = thisRef.containerRef;
  var children = props.children,
    className = props.className,
    draggable = props.draggable;
  var dragPos = state.dragPos;
  var _getPosition = getPosition(thisRef),
    _getPosition2 = (0, _slicedToArray2["default"])(_getPosition, 2),
    x = _getPosition2[0],
    y = _getPosition2[1];
  var transform = "translate(".concat((0, _crispPixel.crispPixel)(x), "px, ").concat((0, _crispPixel.crispPixel)(y), "px)");
  var cursor = draggable ? dragPos ? 'grabbing' : 'grab' : 'auto';
  var control = (0, React.useMemo)(function () {
    var containerStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      transform: transform,
      cursor: cursor
    };
    return React.createElement("div", {
      className: "mapboxgl-marker ".concat(className),
      ref: thisRef.containerRef,
      style: containerStyle
    }, children);
  }, [children, className]);
  var container = containerRef.current;
  if (container) {
    container.style.transform = transform;
    container.style.cursor = cursor;
  }
  return control;
}
Marker.propTypes = propTypes;
var _default = React.memo(Marker);
exports["default"] = _default;
//# sourceMappingURL=marker.js.map