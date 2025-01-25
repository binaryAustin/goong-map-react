"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useMapControl;
exports.mapControlPropTypes = exports.mapControlDefaultProps = void 0;
var _react = require("react");
var PropTypes = _interopRequireWildcard(require("prop-types"));
var _mapContext = _interopRequireDefault(require("./map-context"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var mapControlDefaultProps = {
  captureScroll: false,
  captureDrag: true,
  captureClick: true,
  captureDoubleClick: true,
  capturePointerMove: false
};
exports.mapControlDefaultProps = mapControlDefaultProps;
var mapControlPropTypes = {
  captureScroll: PropTypes.bool,
  captureDrag: PropTypes.bool,
  captureClick: PropTypes.bool,
  captureDoubleClick: PropTypes.bool,
  capturePointerMove: PropTypes.bool
};
exports.mapControlPropTypes = mapControlPropTypes;
function onMount(thisRef) {
  var ref = thisRef.containerRef.current;
  var eventManager = thisRef.context.eventManager;
  if (!ref || !eventManager) {
    return undefined;
  }
  var events = {
    wheel: function wheel(evt) {
      var props = thisRef.props;
      if (props.captureScroll) {
        evt.stopPropagation();
      }
      if (props.onScroll) {
        props.onScroll(evt, thisRef);
      }
    },
    panstart: function panstart(evt) {
      var props = thisRef.props;
      if (props.captureDrag) {
        evt.stopPropagation();
      }
      if (props.onDragStart) {
        props.onDragStart(evt, thisRef);
      }
    },
    anyclick: function anyclick(evt) {
      var props = thisRef.props;
      if (props.captureClick) {
        evt.stopPropagation();
      }
      if (props.onClick) {
        props.onClick(evt, thisRef);
      }
    },
    click: function click(evt) {
      var props = thisRef.props;
      if (props.captureClick) {
        evt.stopPropagation();
      }
      if (props.onClick) {
        props.onClick(evt, thisRef);
      }
    },
    dblclick: function dblclick(evt) {
      var props = thisRef.props;
      if (props.captureDoubleClick) {
        evt.stopPropagation();
      }
      if (props.onDoubleClick) {
        props.onDoubleClick(evt, thisRef);
      }
    },
    pointermove: function pointermove(evt) {
      var props = thisRef.props;
      if (props.capturePointerMove) {
        evt.stopPropagation();
      }
      if (props.onPointerMove) {
        props.onPointerMove(evt, thisRef);
      }
    }
  };
  eventManager.watch(events, ref);
  return function () {
    eventManager.off(events);
  };
}
function useMapControl() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var context = (0, _react.useContext)(_mapContext["default"]);
  var containerRef = (0, _react.useRef)(null);
  var _thisRef = (0, _react.useRef)({
    props: props,
    state: {},
    context: context,
    containerRef: containerRef
  });
  var thisRef = _thisRef.current;
  thisRef.props = props;
  thisRef.context = context;
  (0, _react.useEffect)(function () {
    return onMount(thisRef);
  }, [context.eventManager]);
  return thisRef;
}
//# sourceMappingURL=use-map-control.js.map