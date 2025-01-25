import * as React from 'react';
import { useMemo } from 'react';
import * as PropTypes from 'prop-types';
import MapState from '../utils/map-state';
import { LINEAR_TRANSITION_PROPS } from '../utils/map-controller';
import useMapControl, { mapControlDefaultProps, mapControlPropTypes } from './use-map-control';
const noop = () => {};
const propTypes = Object.assign({}, mapControlPropTypes, {
  className: PropTypes.string,
  style: PropTypes.object,
  onViewStateChange: PropTypes.func,
  onViewportChange: PropTypes.func,
  showCompass: PropTypes.bool,
  showZoom: PropTypes.bool,
  zoomInLabel: PropTypes.string,
  zoomOutLabel: PropTypes.string,
  compassLabel: PropTypes.string
});
const defaultProps = Object.assign({}, mapControlDefaultProps, {
  className: '',
  showCompass: true,
  showZoom: true,
  zoomInLabel: 'Zoom In',
  zoomOutLabel: 'Zoom Out',
  compassLabel: 'Reset North'
});
function updateViewport(context, props, opts) {
  const {
    viewport
  } = context;
  const mapState = new MapState(Object.assign({}, viewport, opts));
  const viewState = Object.assign({}, mapState.getViewportProps(), LINEAR_TRANSITION_PROPS);
  const onViewportChange = props.onViewportChange || context.onViewportChange || noop;
  const onViewStateChange = props.onViewStateChange || context.onViewStateChange || noop;
  onViewStateChange({
    viewState
  });
  onViewportChange(viewState);
}
function renderButton(type, label, callback, children) {
  return React.createElement("button", {
    key: type,
    className: "mapboxgl-ctrl-icon mapboxgl-ctrl-".concat(type),
    type: "button",
    title: label,
    onClick: callback
  }, children || React.createElement("span", {
    className: "mapboxgl-ctrl-icon",
    "aria-hidden": "true"
  }));
}
function renderCompass(context) {
  const {
    bearing
  } = context.viewport;
  const style = {
    transform: "rotate(".concat(-bearing, "deg)")
  };
  return React.createElement("span", {
    className: "mapboxgl-ctrl-icon",
    "aria-hidden": "true",
    style: style
  });
}
function NavigationControl(props) {
  const {
    context,
    containerRef
  } = useMapControl(props);
  const onZoomIn = () => {
    updateViewport(context, props, {
      zoom: context.viewport.zoom + 1
    });
  };
  const onZoomOut = () => {
    updateViewport(context, props, {
      zoom: context.viewport.zoom - 1
    });
  };
  const onResetNorth = () => {
    updateViewport(context, props, {
      bearing: 0,
      pitch: 0
    });
  };
  const {
    className,
    showCompass,
    showZoom,
    zoomInLabel,
    zoomOutLabel,
    compassLabel
  } = props;
  const style = useMemo(() => ({
    position: 'absolute',
    ...props.style
  }), [props.style]);
  return React.createElement("div", {
    style: style,
    className: className
  }, React.createElement("div", {
    className: "mapboxgl-ctrl mapboxgl-ctrl-group",
    ref: containerRef
  }, showZoom && renderButton('zoom-in', zoomInLabel, onZoomIn), showZoom && renderButton('zoom-out', zoomOutLabel, onZoomOut), showCompass && renderButton('compass', compassLabel, onResetNorth, renderCompass(context))));
}
NavigationControl.propTypes = propTypes;
NavigationControl.defaultProps = defaultProps;
export default React.memo(NavigationControl);
//# sourceMappingURL=navigation-control.js.map