import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as PropTypes from 'prop-types';
import { document } from '../utils/globals';
import { normalizeStyle } from '../utils/style-utils';
function noop() {}
function defaultOnError(event) {
  if (event) {
    console.error(event.error);
  }
}
const propTypes = {
  container: PropTypes.object,
  gl: PropTypes.object,
  goongApiAccessToken: PropTypes.string,
  goongApiUrl: PropTypes.string,
  attributionControl: PropTypes.bool,
  preserveDrawingBuffer: PropTypes.bool,
  reuseMaps: PropTypes.bool,
  transformRequest: PropTypes.func,
  mapOptions: PropTypes.object,
  mapStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  preventStyleDiffing: PropTypes.bool,
  visible: PropTypes.bool,
  asyncRender: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  viewState: PropTypes.object,
  longitude: PropTypes.number,
  latitude: PropTypes.number,
  zoom: PropTypes.number,
  bearing: PropTypes.number,
  pitch: PropTypes.number,
  altitude: PropTypes.number
};
const defaultProps = {
  container: document.body,
  goongApiAccessToken: getAccessToken(),
  goongApiUrl: 'https://tiles.goong.io',
  preserveDrawingBuffer: false,
  attributionControl: true,
  reuseMaps: false,
  mapOptions: {},
  mapStyle: 'https://tiles.goong.io/assets/goong_map_web.json',
  preventStyleDiffing: false,
  visible: true,
  asyncRender: false,
  onLoad: noop,
  onError: defaultOnError,
  width: 0,
  height: 0,
  longitude: 0,
  latitude: 0,
  zoom: 0,
  bearing: 0,
  pitch: 0,
  altitude: 1.5
};
export function getAccessToken() {
  let accessToken = null;
  if (typeof window !== 'undefined' && window.location) {
    const match = window.location.search.match(/api_key=([^&\/]*)/);
    accessToken = match && match[1];
  }
  if (!accessToken && typeof process !== 'undefined') {
    accessToken = accessToken || process.env.GoongAccessToken || process.env.REACT_APP_GOONG_ACCESS_TOKEN;
  }
  return accessToken || 'no-token';
}
function checkPropTypes(props) {
  let component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'component';
  if (props.debug) {
    PropTypes.checkPropTypes(propTypes, props, 'prop', component);
  }
}
export default class Goong {
  constructor(props) {
    _defineProperty(this, "props", defaultProps);
    _defineProperty(this, "width", 0);
    _defineProperty(this, "height", 0);
    _defineProperty(this, "_fireLoadEvent", () => {
      this.props.onLoad({
        type: 'load',
        target: this._map
      });
    });
    if (!props.mapboxgl) {
      throw new Error('Goong JS not available');
    }
    this.mapboxgl = props.mapboxgl;
    if (!Goong.initialized) {
      Goong.initialized = true;
      this._checkStyleSheet(this.mapboxgl.version);
    }
    this._initialize(props);
  }
  finalize() {
    this._destroy();
    return this;
  }
  setProps(props) {
    this._update(this.props, props);
    return this;
  }
  redraw() {
    const map = this._map;
    if (map.style) {
      if (map._frame) {
        map._frame.cancel();
        map._frame = null;
      }
      map._render();
    }
  }
  getMap() {
    return this._map;
  }
  _reuse(props) {
    this._map = Goong.savedMap;
    const oldContainer = this._map.getContainer();
    const newContainer = props.container;
    newContainer.classList.add('mapboxgl-map');
    if (oldContainer !== newContainer) {
      while (oldContainer.childNodes.length > 0) {
        newContainer.appendChild(oldContainer.childNodes[0]);
      }
    }
    this._map._container = newContainer;
    Goong.savedMap = null;
    if (props.mapStyle) {
      this._map.setStyle(normalizeStyle(props.mapStyle), {
        diff: false
      });
    }
    if (this._map.isStyleLoaded()) {
      this._fireLoadEvent();
    } else {
      this._map.once('styledata', this._fireLoadEvent);
    }
  }
  _create(props) {
    if (props.reuseMaps && Goong.savedMap) {
      this._reuse(props);
    } else {
      if (props.gl) {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = () => {
          HTMLCanvasElement.prototype.getContext = getContext;
          return props.gl;
        };
      }
      const mapOptions = {
        container: props.container,
        center: [0, 0],
        zoom: 8,
        pitch: 0,
        bearing: 0,
        maxZoom: 24,
        style: normalizeStyle(props.mapStyle),
        interactive: false,
        trackResize: false,
        attributionControl: props.attributionControl,
        preserveDrawingBuffer: props.preserveDrawingBuffer
      };
      if (props.transformRequest) {
        mapOptions.transformRequest = props.transformRequest;
      }
      this._map = new this.mapboxgl.Map(Object.assign({}, mapOptions, props.mapOptions));
      this._map.once('load', props.onLoad);
      this._map.on('error', props.onError);
    }
    return this;
  }
  _destroy() {
    if (!this._map) {
      return;
    }
    if (this.props.reuseMaps && !Goong.savedMap) {
      Goong.savedMap = this._map;
      this._map.off('load', this.props.onLoad);
      this._map.off('error', this.props.onError);
      this._map.off('styledata', this._fireLoadEvent);
    } else {
      this._map.remove();
    }
    this._map = null;
  }
  _initialize(props) {
    props = Object.assign({}, defaultProps, props);
    checkPropTypes(props, 'Goong');
    this.mapboxgl.accessToken = props.goongApiAccessToken || defaultProps.goongApiAccessToken;
    this.mapboxgl.baseApiUrl = props.goongApiUrl;
    this._create(props);
    const {
      container
    } = props;
    Object.defineProperty(container, 'offsetWidth', {
      configurable: true,
      get: () => this.width
    });
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      get: () => this.width
    });
    Object.defineProperty(container, 'offsetHeight', {
      configurable: true,
      get: () => this.height
    });
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      get: () => this.height
    });
    const canvas = this._map.getCanvas();
    if (canvas) {
      canvas.style.outline = 'none';
    }
    this._updateMapViewport({}, props);
    this._updateMapSize({}, props);
    this.props = props;
  }
  _update(oldProps, newProps) {
    if (!this._map) {
      return;
    }
    newProps = Object.assign({}, this.props, newProps);
    checkPropTypes(newProps, 'Goong');
    const viewportChanged = this._updateMapViewport(oldProps, newProps);
    const sizeChanged = this._updateMapSize(oldProps, newProps);
    this._updateMapStyle(oldProps, newProps);
    if (!newProps.asyncRender && (viewportChanged || sizeChanged)) {
      this.redraw();
    }
    this.props = newProps;
  }
  _updateMapStyle(oldProps, newProps) {
    const styleChanged = oldProps.mapStyle !== newProps.mapStyle;
    if (styleChanged) {
      this._map.setStyle(normalizeStyle(newProps.mapStyle), {
        diff: !newProps.preventStyleDiffing
      });
    }
  }
  _updateMapSize(oldProps, newProps) {
    const sizeChanged = oldProps.width !== newProps.width || oldProps.height !== newProps.height;
    if (sizeChanged) {
      this.width = newProps.width;
      this.height = newProps.height;
      this._map.resize();
    }
    return sizeChanged;
  }
  _updateMapViewport(oldProps, newProps) {
    const oldViewState = this._getViewState(oldProps);
    const newViewState = this._getViewState(newProps);
    const viewportChanged = newViewState.latitude !== oldViewState.latitude || newViewState.longitude !== oldViewState.longitude || newViewState.zoom !== oldViewState.zoom || newViewState.pitch !== oldViewState.pitch || newViewState.bearing !== oldViewState.bearing || newViewState.altitude !== oldViewState.altitude;
    if (viewportChanged) {
      this._map.jumpTo(this._viewStateToMapboxProps(newViewState));
      if (newViewState.altitude !== oldViewState.altitude) {
        this._map.transform.altitude = newViewState.altitude;
      }
    }
    return viewportChanged;
  }
  _getViewState(props) {
    const {
      longitude,
      latitude,
      zoom,
      pitch = 0,
      bearing = 0,
      altitude = 1.5
    } = props.viewState || props;
    return {
      longitude,
      latitude,
      zoom,
      pitch,
      bearing,
      altitude
    };
  }
  _checkStyleSheet() {
    let goongVersion = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1.0.6';
    if (typeof document === 'undefined') {
      return;
    }
    try {
      const testElement = document.createElement('div');
      testElement.className = 'mapboxgl-map';
      testElement.style.display = 'none';
      document.body.appendChild(testElement);
      const isCssLoaded = window.getComputedStyle(testElement).position !== 'static';
      if (!isCssLoaded) {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@".concat(goongVersion, "/dist/goong-js.css"));
        document.head.appendChild(link);
      }
    } catch (error) {}
  }
  _viewStateToMapboxProps(viewState) {
    return {
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      bearing: viewState.bearing,
      pitch: viewState.pitch
    };
  }
}
_defineProperty(Goong, "initialized", false);
_defineProperty(Goong, "propTypes", propTypes);
_defineProperty(Goong, "defaultProps", defaultProps);
_defineProperty(Goong, "savedMap", null);
//# sourceMappingURL=goong.js.map