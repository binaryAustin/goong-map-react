import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["layout", "paint", "filter", "minzoom", "maxzoom", "beforeId"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
import { useContext, useEffect, useMemo, useState, useRef } from 'react';
import * as PropTypes from 'prop-types';
import MapContext from './map-context';
import assert from '../utils/assert';
import deepEqual from '../utils/deep-equal';
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
    otherProps = _objectWithoutProperties(props, _excluded);
  if (beforeId !== prevProps.beforeId) {
    map.moveLayer(id, beforeId);
  }
  if (layout !== prevProps.layout) {
    var prevLayout = prevProps.layout || {};
    for (var key in layout) {
      if (!deepEqual(layout[key], prevLayout[key])) {
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
      if (!deepEqual(paint[_key2], prevPaint[_key2])) {
        map.setPaintProperty(id, _key2, paint[_key2]);
      }
    }
    for (var _key3 in prevPaint) {
      if (!paint.hasOwnProperty(_key3)) {
        map.setPaintProperty(id, _key3, undefined);
      }
    }
  }
  if (!deepEqual(filter, prevProps.filter)) {
    map.setFilter(id, filter);
  }
  if (minzoom !== prevProps.minzoom || maxzoom !== prevProps.maxzoom) {
    map.setLayerZoomRange(id, minzoom, maxzoom);
  }
  for (var _key4 in otherProps) {
    if (!deepEqual(otherProps[_key4], prevProps[_key4])) {
      map.setLayerProperty(id, _key4, otherProps[_key4]);
    }
  }
}
function createLayer(map, id, props) {
  if (map.style && map.style._loaded && (!('source' in props) || map.getSource(props.source))) {
    var options = _objectSpread(_objectSpread({}, props), {}, {
      id: id
    });
    delete options.beforeId;
    map.addLayer(options, props.beforeId);
  }
}
function updateLayer(map, id, props, prevProps) {
  assert(props.id === prevProps.id, 'layer id changed');
  assert(props.type === prevProps.type, 'layer type changed');
  try {
    diffLayerStyles(map, id, props, prevProps);
  } catch (error) {
    console.warn(error);
  }
}
var layerCounter = 0;
function Layer(props) {
  var context = useContext(MapContext);
  var propsRef = useRef({
    id: props.id,
    type: props.type
  });
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    setStyleLoaded = _useState2[1];
  var id = useMemo(function () {
    return props.id || "jsx-layer-".concat(layerCounter++);
  }, []);
  var map = context.map;
  useEffect(function () {
    if (map) {
      var forceUpdate = function forceUpdate() {
        return setStyleLoaded(function (version) {
          return version + 1;
        });
      };
      map.on('styledata', forceUpdate);
      return function () {
        map.off('styledata', forceUpdate);
        if (map.style && map.style._loaded && map.getLayer(id)) {
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
export default Layer;
//# sourceMappingURL=layer.js.map