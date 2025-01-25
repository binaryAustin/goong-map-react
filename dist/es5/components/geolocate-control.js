"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var React = _interopRequireWildcard(require("react"));
var PropTypes = _interopRequireWildcard(require("prop-types"));
var _globals = require("../utils/globals");
var _goongmap = _interopRequireDefault(require("../utils/goongmap"));
var _mapState = _interopRequireDefault(require("../utils/map-state"));
var _mapController = require("../utils/map-controller");
var _geolocateUtils = require("../utils/geolocate-utils");
var _useMapControl = _interopRequireWildcard(require("./use-map-control"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var noop = function noop() {};
var propTypes = Object.assign({}, _useMapControl.mapControlPropTypes, {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  disabledLabel: PropTypes.string,
  auto: PropTypes.bool,
  positionOptions: PropTypes.object,
  fitBoundsOptions: PropTypes.object,
  trackUserLocation: PropTypes.bool,
  showUserLocation: PropTypes.bool,
  showAccuracyCircle: PropTypes.bool,
  onViewStateChange: PropTypes.func,
  onViewportChange: PropTypes.func,
  onGeolocate: PropTypes.func
});
var defaultProps = Object.assign({}, _useMapControl.mapControlDefaultProps, {
  className: '',
  label: 'Find My Location',
  disabledLabel: 'Location Not Available',
  auto: false,
  positionOptions: {
    enableHighAccuracy: false,
    timeout: 6000
  },
  fitBoundsOptions: {
    maxZoom: 15
  },
  trackUserLocation: false,
  showUserLocation: true,
  showAccuracyCircle: true,
  onGeolocate: function onGeolocate() {}
});
function getBounds(position) {
  var center = new _goongmap["default"].LngLat(position.coords.longitude, position.coords.latitude);
  var radius = position.coords.accuracy;
  var bounds = center.toBounds(radius);
  return [[bounds._ne.lng, bounds._ne.lat], [bounds._sw.lng, bounds._sw.lat]];
}
function setupMapboxGeolocateControl(context, props, geolocateButton) {
  var control = new _goongmap["default"].GeolocateControl(props);
  control._container = _globals.document.createElement('div');
  control._map = {
    on: function on() {},
    _getUIString: function _getUIString() {
      return '';
    }
  };
  control._setupUI(true);
  control._map = context.map;
  control._geolocateButton = geolocateButton;
  var eventManager = context.eventManager;
  if (control.options.trackUserLocation && eventManager) {
    eventManager.on('panstart', function () {
      if (control._watchState === 'ACTIVE_LOCK') {
        control._watchState = 'BACKGROUND';
        geolocateButton.classList.add('mapboxgl-ctrl-geolocate-background');
        geolocateButton.classList.remove('mapboxgl-ctrl-geolocate-active');
      }
    });
  }
  control.on('geolocate', props.onGeolocate);
  return control;
}
function updateCamera(position, _ref) {
  var context = _ref.context,
    props = _ref.props;
  var bounds = getBounds(position);
  var _context$viewport$fit = context.viewport.fitBounds(bounds, props.fitBoundsOptions),
    longitude = _context$viewport$fit.longitude,
    latitude = _context$viewport$fit.latitude,
    zoom = _context$viewport$fit.zoom;
  var newViewState = Object.assign({}, context.viewport, {
    longitude: longitude,
    latitude: latitude,
    zoom: zoom
  });
  var mapState = new _mapState["default"](newViewState);
  var viewState = Object.assign({}, mapState.getViewportProps(), _mapController.LINEAR_TRANSITION_PROPS);
  var onViewportChange = props.onViewportChange || context.onViewportChange || noop;
  var onViewStateChange = props.onViewStateChange || context.onViewStateChange || noop;
  onViewStateChange({
    viewState: viewState
  });
  onViewportChange(viewState);
}
function GeolocateControl(props) {
  var thisRef = (0, _useMapControl["default"])(props);
  var context = thisRef.context,
    containerRef = thisRef.containerRef;
  var geolocateButtonRef = (0, React.useRef)(null);
  var _useState = (0, React.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    mapboxGeolocateControl = _useState2[0],
    createMapboxGeolocateControl = _useState2[1];
  var _useState3 = (0, React.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    supportsGeolocation = _useState4[0],
    setSupportsGeolocation = _useState4[1];
  (0, React.useEffect)(function () {
    var control;
    if (context.map) {
      (0, _geolocateUtils.isGeolocationSupported)().then(function (result) {
        setSupportsGeolocation(result);
        if (geolocateButtonRef.current) {
          control = setupMapboxGeolocateControl(context, props, geolocateButtonRef.current);
          control._updateCamera = function (position) {
            return updateCamera(position, thisRef);
          };
          createMapboxGeolocateControl(control);
        }
      });
    }
    return function () {
      if (control) {
        control._clearWatch();
      }
    };
  }, [context.map]);
  var triggerGeolocate = (0, React.useCallback)(function () {
    if (mapboxGeolocateControl) {
      mapboxGeolocateControl.options = thisRef.props;
      mapboxGeolocateControl.trigger();
    }
  }, [mapboxGeolocateControl]);
  (0, React.useEffect)(function () {
    if (props.auto) {
      triggerGeolocate();
    }
  }, [mapboxGeolocateControl, props.auto]);
  (0, React.useEffect)(function () {
    if (mapboxGeolocateControl) {}
  }, [context.viewport.zoom]);
  var className = props.className,
    label = props.label,
    disabledLabel = props.disabledLabel,
    trackUserLocation = props.trackUserLocation;
  var style = (0, React.useMemo)(function () {
    return _objectSpread({
      position: 'absolute'
    }, props.style);
  }, [props.style]);
  return React.createElement("div", {
    style: style,
    className: className
  }, React.createElement("div", {
    key: "geolocate-control",
    className: "mapboxgl-ctrl mapboxgl-ctrl-group",
    ref: containerRef
  }, React.createElement("button", {
    key: "geolocate",
    className: "mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate",
    ref: geolocateButtonRef,
    disabled: !supportsGeolocation,
    "aria-pressed": !trackUserLocation,
    type: "button",
    title: supportsGeolocation ? label : disabledLabel,
    "aria-label": supportsGeolocation ? label : disabledLabel,
    onClick: triggerGeolocate
  }, React.createElement("span", {
    className: "mapboxgl-ctrl-icon",
    "aria-hidden": "true"
  }))));
}
GeolocateControl.propTypes = propTypes;
GeolocateControl.defaultProps = defaultProps;
var _default = React.memo(GeolocateControl);
exports["default"] = _default;
//# sourceMappingURL=geolocate-control.js.map