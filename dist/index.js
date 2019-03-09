'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css');

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mapboxGlGeocoder = require('@mapbox/mapbox-gl-geocoder');

var _mapboxGlGeocoder2 = _interopRequireDefault(_mapboxGlGeocoder);

var _reactMapGl = require('react-map-gl');

var _viewportMercatorProject = require('viewport-mercator-project');

var _viewportMercatorProject2 = _interopRequireDefault(_viewportMercatorProject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VALID_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

function fitBounds(bounds, viewport) {
  return new _viewportMercatorProject2.default(viewport).fitBounds(bounds);
}

function getAccessToken() {
  var accessToken = null;

  if (typeof window !== 'undefined' && window.location) {
    var match = window.location.search.match(/access_token=([^&/]*)/);
    accessToken = match && match[1];
  }

  if (!accessToken && typeof process !== 'undefined') {
    // Note: This depends on bundler plugins (e.g. webpack) inmporting environment correctly
    accessToken = accessToken || process.env.MapboxAccessToken; // eslint-disable-line
  }

  return accessToken || null;
}

var Geocoder = function (_Component) {
  _inherits(Geocoder, _Component);

  function Geocoder() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Geocoder);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Geocoder.__proto__ || Object.getPrototypeOf(Geocoder)).call.apply(_ref, [this].concat(args))), _this), _this.geocoder = null, _this.cachedResult = '', _this.initializeGeocoder = function () {
      var mapboxMap = _this.getMapboxMap();
      var containerNode = _this.getContainerNode();
      var _this$props = _this.props,
          mapboxApiAccessToken = _this$props.mapboxApiAccessToken,
          zoom = _this$props.zoom,
          flyTo = _this$props.flyTo,
          placeholder = _this$props.placeholder,
          proximity = _this$props.proximity,
          trackProximity = _this$props.trackProximity,
          bbox = _this$props.bbox,
          types = _this$props.types,
          country = _this$props.country,
          minLength = _this$props.minLength,
          limit = _this$props.limit,
          language = _this$props.language,
          filter = _this$props.filter,
          localGeocoder = _this$props.localGeocoder,
          options = _this$props.options,
          onInit = _this$props.onInit,
          position = _this$props.position;


      _this.geocoder = new _mapboxGlGeocoder2.default(_extends({
        accessToken: mapboxApiAccessToken,
        zoom: zoom,
        flyTo: flyTo,
        placeholder: placeholder,
        proximity: proximity,
        trackProximity: trackProximity,
        bbox: bbox,
        types: types,
        country: country,
        minLength: minLength,
        limit: limit,
        language: language,
        filter: filter,
        localGeocoder: localGeocoder
      }, options));
      _this.subscribeEvents();

      if (containerNode) {
        containerNode.appendChild(_this.geocoder.onAdd(mapboxMap));
      } else {
        mapboxMap.addControl(_this.geocoder, VALID_POSITIONS.find(function (_position) {
          return position === _position;
        }));
      }

      _this.geocoder.setInput(_this.cachedResult);
      onInit(_this.geocoder);
    }, _this.getMapboxMap = function () {
      var mapRef = _this.props.mapRef;


      return mapRef && mapRef.current && mapRef.current.getMap() || null;
    }, _this.getContainerNode = function () {
      var containerRef = _this.props.containerRef;


      return containerRef && containerRef.current || null;
    }, _this.subscribeEvents = function () {
      _this.geocoder.on('clear', _this.handleClear);
      _this.geocoder.on('loading', _this.handleLoading);
      _this.geocoder.on('results', _this.handleResults);
      _this.geocoder.on('result', _this.handleResult);
      _this.geocoder.on('error', _this.handleError);
    }, _this.unsubscribeEvents = function () {
      _this.geocoder.off('clear', _this.handleClear);
      _this.geocoder.off('loading', _this.handleLoading);
      _this.geocoder.off('results', _this.handleResults);
      _this.geocoder.off('result', _this.handleResult);
      _this.geocoder.off('error', _this.handleError);
    }, _this.removeGeocoder = function () {
      var mapboxMap = _this.getMapboxMap();

      _this.unsubscribeEvents();

      if (mapboxMap && mapboxMap.removeControl) {
        _this.getMapboxMap().removeControl(_this.geocoder);
      }

      _this.geocoder = null;
    }, _this.handleClear = function () {
      _this.props.onClear();
    }, _this.handleLoading = function (event) {
      _this.props.onLoading(event);
    }, _this.handleResults = function (event) {
      _this.props.onResults(event);
    }, _this.handleResult = function (event) {
      var result = event.result;
      var _this$props2 = _this.props,
          mapRef = _this$props2.mapRef,
          onViewportChange = _this$props2.onViewportChange,
          onResult = _this$props2.onResult;
      var id = result.id,
          bbox = result.bbox,
          center = result.center;

      var _center = _slicedToArray(center, 2),
          longitude = _center[0],
          latitude = _center[1];

      var bboxExceptions = {
        'country.3148': {
          name: 'France',
          bbox: [[-4.59235, 41.380007], [9.560016, 51.148506]]
        },
        'country.3145': {
          name: 'United States',
          bbox: [[-171.791111, 18.91619], [-66.96466, 71.357764]]
        },
        'country.330': {
          name: 'Russia',
          bbox: [[19.66064, 41.151416], [190.10042, 81.2504]]
        },
        'country.3179': {
          name: 'Canada',
          bbox: [[-140.99778, 41.675105], [-52.648099, 83.23324]]
        }
      };
      var width = mapRef.current.props.width;
      var height = mapRef.current.props.height;
      var zoom = _this.geocoder.options.zoom;

      if (!bboxExceptions[id] && bbox) {
        zoom = fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], { width: width, height: height }).zoom;
      } else if (bboxExceptions[id]) {
        zoom = fitBounds(bboxExceptions[id].bbox, { width: width, height: height }).zoom;
      }

      if (_this.geocoder.options.flyTo) {
        onViewportChange({
          longitude: longitude,
          latitude: latitude,
          zoom: zoom,
          transitionInterpolator: new _reactMapGl.FlyToInterpolator(),
          transitionDuration: 3000
        });
      } else {
        onViewportChange({ longitude: longitude, latitude: latitude, zoom: zoom });
      }

      onResult(event);

      if (result && result.place_name) {
        _this.cachedResult = result.place_name;
      }
    }, _this.handleError = function (event) {
      _this.props.onError(event);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Geocoder, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.initializeGeocoder();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeGeocoder();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.removeGeocoder();
      this.initializeGeocoder();
    }
  }, {
    key: 'getGeocoder',
    value: function getGeocoder() {
      return this.geocoder;
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return Geocoder;
}(_react.Component);

Geocoder.propTypes = {
  mapRef: _propTypes2.default.object.isRequired,
  containerRef: _propTypes2.default.object,
  onViewportChange: _propTypes2.default.func.isRequired,
  mapboxApiAccessToken: _propTypes2.default.string,
  zoom: _propTypes2.default.number,
  flyTo: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,
  proximity: _propTypes2.default.object,
  trackProximity: _propTypes2.default.bool,
  bbox: _propTypes2.default.array,
  types: _propTypes2.default.string,
  country: _propTypes2.default.string,
  minLength: _propTypes2.default.number,
  limit: _propTypes2.default.number,
  language: _propTypes2.default.string,
  filter: _propTypes2.default.func,
  localGeocoder: _propTypes2.default.func,
  position: _propTypes2.default.oneOf(VALID_POSITIONS),
  onInit: _propTypes2.default.func,
  onClear: _propTypes2.default.func,
  onLoading: _propTypes2.default.func,
  onResults: _propTypes2.default.func,
  onResult: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  options: _propTypes2.default.object // deprecated and will be removed in v2
};
Geocoder.defaultProps = {
  mapboxApiAccessToken: getAccessToken(),
  zoom: 16,
  flyTo: true,
  placeholder: 'Search',
  trackProximity: false,
  minLength: 2,
  limit: 5,
  position: 'top-right',
  onInit: function onInit() {},
  onClear: function onClear() {},
  onLoading: function onLoading() {},
  onResults: function onResults() {},
  onResult: function onResult() {},
  onError: function onError() {}
};
exports.default = Geocoder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJWQUxJRF9QT1NJVElPTlMiLCJmaXRCb3VuZHMiLCJib3VuZHMiLCJ2aWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJnZXRBY2Nlc3NUb2tlbiIsImFjY2Vzc1Rva2VuIiwid2luZG93IiwibG9jYXRpb24iLCJtYXRjaCIsInNlYXJjaCIsInByb2Nlc3MiLCJlbnYiLCJNYXBib3hBY2Nlc3NUb2tlbiIsIkdlb2NvZGVyIiwiZ2VvY29kZXIiLCJjYWNoZWRSZXN1bHQiLCJpbml0aWFsaXplR2VvY29kZXIiLCJtYXBib3hNYXAiLCJnZXRNYXBib3hNYXAiLCJjb250YWluZXJOb2RlIiwiZ2V0Q29udGFpbmVyTm9kZSIsInByb3BzIiwibWFwYm94QXBpQWNjZXNzVG9rZW4iLCJ6b29tIiwiZmx5VG8iLCJwbGFjZWhvbGRlciIsInByb3hpbWl0eSIsInRyYWNrUHJveGltaXR5IiwiYmJveCIsInR5cGVzIiwiY291bnRyeSIsIm1pbkxlbmd0aCIsImxpbWl0IiwibGFuZ3VhZ2UiLCJmaWx0ZXIiLCJsb2NhbEdlb2NvZGVyIiwib3B0aW9ucyIsIm9uSW5pdCIsInBvc2l0aW9uIiwiTWFwYm94R2VvY29kZXIiLCJzdWJzY3JpYmVFdmVudHMiLCJhcHBlbmRDaGlsZCIsIm9uQWRkIiwiYWRkQ29udHJvbCIsImZpbmQiLCJfcG9zaXRpb24iLCJzZXRJbnB1dCIsIm1hcFJlZiIsImN1cnJlbnQiLCJnZXRNYXAiLCJjb250YWluZXJSZWYiLCJvbiIsImhhbmRsZUNsZWFyIiwiaGFuZGxlTG9hZGluZyIsImhhbmRsZVJlc3VsdHMiLCJoYW5kbGVSZXN1bHQiLCJoYW5kbGVFcnJvciIsInVuc3Vic2NyaWJlRXZlbnRzIiwib2ZmIiwicmVtb3ZlR2VvY29kZXIiLCJyZW1vdmVDb250cm9sIiwib25DbGVhciIsImV2ZW50Iiwib25Mb2FkaW5nIiwib25SZXN1bHRzIiwicmVzdWx0Iiwib25WaWV3cG9ydENoYW5nZSIsIm9uUmVzdWx0IiwiaWQiLCJjZW50ZXIiLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsImJib3hFeGNlcHRpb25zIiwibmFtZSIsIndpZHRoIiwiaGVpZ2h0IiwidHJhbnNpdGlvbkludGVycG9sYXRvciIsIkZseVRvSW50ZXJwb2xhdG9yIiwidHJhbnNpdGlvbkR1cmF0aW9uIiwicGxhY2VfbmFtZSIsIm9uRXJyb3IiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiZnVuYyIsInN0cmluZyIsIm51bWJlciIsImJvb2wiLCJhcnJheSIsIm9uZU9mIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixDQUFDLFVBQUQsRUFBYSxXQUFiLEVBQTBCLGFBQTFCLEVBQXlDLGNBQXpDLENBQXhCOztBQUVBLFNBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxRQUEzQixFQUFxQztBQUNuQyxTQUFPLElBQUlDLGlDQUFKLENBQXdCRCxRQUF4QixFQUFrQ0YsU0FBbEMsQ0FBNENDLE1BQTVDLENBQVA7QUFDRDs7QUFFRCxTQUFTRyxjQUFULEdBQTBCO0FBQ3hCLE1BQUlDLGNBQWMsSUFBbEI7O0FBRUEsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxRQUE1QyxFQUFzRDtBQUNwRCxRQUFNQyxRQUFRRixPQUFPQyxRQUFQLENBQWdCRSxNQUFoQixDQUF1QkQsS0FBdkIsQ0FBNkIsdUJBQTdCLENBQWQ7QUFDQUgsa0JBQWNHLFNBQVNBLE1BQU0sQ0FBTixDQUF2QjtBQUNEOztBQUVELE1BQUksQ0FBQ0gsV0FBRCxJQUFnQixPQUFPSyxPQUFQLEtBQW1CLFdBQXZDLEVBQW9EO0FBQ2xEO0FBQ0FMLGtCQUFjQSxlQUFlSyxRQUFRQyxHQUFSLENBQVlDLGlCQUF6QyxDQUZrRCxDQUVTO0FB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d0JqQk4sV0FBU0csb0JBQVVHLElBeEJGO0FBeUJqQmxELFdBQVMrQyxvQkFBVUMsTUF6QkYsQ0F5QlM7QUF6QlQsQztBQXpMZnZFLFEsQ0FxTkcrRSxZLEdBQWU7QUFDcEJ0RSx3QkFBc0JsQixnQkFERjtBQUVwQm1CLFFBQU0sRUFGYztBQUdwQkMsU0FBTyxJQUhhO0FBSXBCQyxlQUFhLFFBSk87QUFLcEJFLGtCQUFnQixLQUxJO0FBTXBCSSxhQUFXLENBTlM7QUFPcEJDLFNBQU8sQ0FQYTtBQVFwQk0sWUFBVSxXQVJVO0FBU3BCRCxVQUFRLGtCQUFNLENBQUUsQ0FUSTtBQVVwQndCLFdBQVMsbUJBQU0sQ0FBRSxDQVZHO0FBV3BCRSxhQUFXLHFCQUFNLENBQUUsQ0FYQztBQVlwQkMsYUFBVyxxQkFBTSxDQUFFLENBWkM7QUFhcEJHLFlBQVUsb0JBQU0sQ0FBRSxDQWJFO0FBY3BCYSxXQUFTLG1CQUFNLENBQUU7QUFkRyxDO2tCQWtCVG5FLFEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0BtYXBib3gvbWFwYm94LWdsLWdlb2NvZGVyL2Rpc3QvbWFwYm94LWdsLWdlb2NvZGVyLmNzcydcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IE1hcGJveEdlb2NvZGVyIGZyb20gJ0BtYXBib3gvbWFwYm94LWdsLWdlb2NvZGVyJ1xuaW1wb3J0IHsgRmx5VG9JbnRlcnBvbGF0b3IgfSBmcm9tICdyZWFjdC1tYXAtZ2wnXG5pbXBvcnQgV2ViTWVyY2F0b3JWaWV3cG9ydCBmcm9tICd2aWV3cG9ydC1tZXJjYXRvci1wcm9qZWN0J1xuXG5jb25zdCBWQUxJRF9QT1NJVElPTlMgPSBbJ3RvcC1sZWZ0JywgJ3RvcC1yaWdodCcsICdib3R0b20tbGVmdCcsICdib3R0b20tcmlnaHQnXVxuXG5mdW5jdGlvbiBmaXRCb3VuZHMoYm91bmRzLCB2aWV3cG9ydCkge1xuICByZXR1cm4gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQodmlld3BvcnQpLmZpdEJvdW5kcyhib3VuZHMpXG59XG5cbmZ1bmN0aW9uIGdldEFjY2Vzc1Rva2VuKCkge1xuICBsZXQgYWNjZXNzVG9rZW4gPSBudWxsXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhdGlvbikge1xuICAgIGNvbnN0IG1hdGNoID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5tYXRjaCgvYWNjZXNzX3Rva2VuPShbXiYvXSopLylcbiAgICBhY2Nlc3NUb2tlbiA9IG1hdGNoICYmIG1hdGNoWzFdXG4gIH1cblxuICBpZiAoIWFjY2Vzc1Rva2VuICYmIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIE5vdGU6IFRoaXMgZGVwZW5kcyBvbiBidW5kbGVyIHBsdWdpbnMgKGUuZy4gd2VicGFjaykgaW5tcG9ydGluZyBlbnZpcm9ubWVudCBjb3JyZWN0bHlcbiAgICBhY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuIHx8IHByb2Nlc3MuZW52Lk1hcGJveEFjY2Vzc1Rva2VuIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgfVxuXG4gIHJldHVybiBhY2Nlc3NUb2tlbiB8fCBudWxsXG59XG5cbmNsYXNzIEdlb2NvZGVyIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgZ2VvY29kZXIgPSBudWxsXG4gIGNhY2hlZFJlc3VsdCA9ICcnXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplR2VvY29kZXIoKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5yZW1vdmVHZW9jb2RlcigpXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgdGhpcy5yZW1vdmVHZW9jb2RlcigpXG4gICAgdGhpcy5pbml0aWFsaXplR2VvY29kZXIoKVxuICB9XG5cbiAgaW5pdGlhbGl6ZUdlb2NvZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IG1hcGJveE1hcCA9IHRoaXMuZ2V0TWFwYm94TWFwKClcbiAgICBjb25zdCBjb250YWluZXJOb2RlID0gdGhpcy5nZXRDb250YWluZXJOb2RlKClcbiAgICBjb25zdCB7XG4gICAgICBtYXBib3hBcGlBY2Nlc3NUb2tlbixcbiAgICAgIHpvb20sXG4gICAgICBmbHlUbyxcbiAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgcHJveGltaXR5LFxuICAgICAgdHJhY2tQcm94aW1pdHksXG4gICAgICBiYm94LFxuICAgICAgdHlwZXMsXG4gICAgICBjb3VudHJ5LFxuICAgICAgbWluTGVuZ3RoLFxuICAgICAgbGltaXQsXG4gICAgICBsYW5ndWFnZSxcbiAgICAgIGZpbHRlcixcbiAgICAgIGxvY2FsR2VvY29kZXIsXG4gICAgICBvcHRpb25zLFxuICAgICAgb25Jbml0LFxuICAgICAgcG9zaXRpb25cbiAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgdGhpcy5nZW9jb2RlciA9IG5ldyBNYXBib3hHZW9jb2Rlcih7XG4gICAgICBhY2Nlc3NUb2tlbjogbWFwYm94QXBpQWNjZXNzVG9rZW4sXG4gICAgICB6b29tLFxuICAgICAgZmx5VG8sXG4gICAgICBwbGFjZWhvbGRlcixcbiAgICAgIHByb3hpbWl0eSxcbiAgICAgIHRyYWNrUHJveGltaXR5LFxuICAgICAgYmJveCxcbiAgICAgIHR5cGVzLFxuICAgICAgY291bnRyeSxcbiAgICAgIG1pbkxlbmd0aCxcbiAgICAgIGxpbWl0LFxuICAgICAgbGFuZ3VhZ2UsXG4gICAgICBmaWx0ZXIsXG4gICAgICBsb2NhbEdlb2NvZGVyLFxuICAgICAgLi4ub3B0aW9uc1xuICAgIH0pXG4gICAgdGhpcy5zdWJzY3JpYmVFdmVudHMoKVxuXG4gICAgaWYgKGNvbnRhaW5lck5vZGUpIHtcbiAgICAgIGNvbnRhaW5lck5vZGUuYXBwZW5kQ2hpbGQodGhpcy5nZW9jb2Rlci5vbkFkZChtYXBib3hNYXApKVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXBib3hNYXAuYWRkQ29udHJvbCh0aGlzLmdlb2NvZGVyLCBWQUxJRF9QT1NJVElPTlMuZmluZCgoX3Bvc2l0aW9uKSA9PiBwb3NpdGlvbiA9PT0gX3Bvc2l0aW9uKSlcbiAgICB9XG5cbiAgICB0aGlzLmdlb2NvZGVyLnNldElucHV0KHRoaXMuY2FjaGVkUmVzdWx0KVxuICAgIG9uSW5pdCh0aGlzLmdlb2NvZGVyKVxuICB9XG5cbiAgZ2V0TWFwYm94TWFwID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgbWFwUmVmIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKG1hcFJlZiAmJiBtYXBSZWYuY3VycmVudCAmJiBtYXBSZWYuY3VycmVudC5nZXRNYXAoKSkgfHwgbnVsbFxuICB9XG5cbiAgZ2V0Q29udGFpbmVyTm9kZSA9ICgpID0+IHtcbiAgICBjb25zdCB7IGNvbnRhaW5lclJlZiB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChjb250YWluZXJSZWYgJiYgY29udGFpbmVyUmVmLmN1cnJlbnQpIHx8IG51bGxcbiAgfVxuXG4gIHN1YnNjcmliZUV2ZW50cyA9ICgpID0+IHtcbiAgICB0aGlzLmdlb2NvZGVyLm9uKCdjbGVhcicsIHRoaXMuaGFuZGxlQ2xlYXIpXG4gICAgdGhpcy5nZW9jb2Rlci5vbignbG9hZGluZycsIHRoaXMuaGFuZGxlTG9hZGluZylcbiAgICB0aGlzLmdlb2NvZGVyLm9uKCdyZXN1bHRzJywgdGhpcy5oYW5kbGVSZXN1bHRzKVxuICAgIHRoaXMuZ2VvY29kZXIub24oJ3Jlc3VsdCcsIHRoaXMuaGFuZGxlUmVzdWx0KVxuICAgIHRoaXMuZ2VvY29kZXIub24oJ2Vycm9yJywgdGhpcy5oYW5kbGVFcnJvcilcbiAgfVxuXG4gIHVuc3Vic2NyaWJlRXZlbnRzID0gKCkgPT4ge1xuICAgIHRoaXMuZ2VvY29kZXIub2ZmKCdjbGVhcicsIHRoaXMuaGFuZGxlQ2xlYXIpXG4gICAgdGhpcy5nZW9jb2Rlci5vZmYoJ2xvYWRpbmcnLCB0aGlzLmhhbmRsZUxvYWRpbmcpXG4gICAgdGhpcy5nZW9jb2Rlci5vZmYoJ3Jlc3VsdHMnLCB0aGlzLmhhbmRsZVJlc3VsdHMpXG4gICAgdGhpcy5nZW9jb2Rlci5vZmYoJ3Jlc3VsdCcsIHRoaXMuaGFuZGxlUmVzdWx0KVxuICAgIHRoaXMuZ2VvY29kZXIub2ZmKCdlcnJvcicsIHRoaXMuaGFuZGxlRXJyb3IpXG4gIH1cblxuICByZW1vdmVHZW9jb2RlciA9ICgpID0+IHtcbiAgICBjb25zdCBtYXBib3hNYXAgPSB0aGlzLmdldE1hcGJveE1hcCgpXG5cbiAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRzKClcblxuICAgIGlmIChtYXBib3hNYXAgJiYgbWFwYm94TWFwLnJlbW92ZUNvbnRyb2wpIHtcbiAgICAgIHRoaXMuZ2V0TWFwYm94TWFwKCkucmVtb3ZlQ29udHJvbCh0aGlzLmdlb2NvZGVyKVxuICAgIH1cblxuICAgIHRoaXMuZ2VvY29kZXIgPSBudWxsXG4gIH1cblxuICBoYW5kbGVDbGVhciA9ICgpID0+IHtcbiAgICB0aGlzLnByb3BzLm9uQ2xlYXIoKVxuICB9XG5cbiAgaGFuZGxlTG9hZGluZyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25Mb2FkaW5nKGV2ZW50KVxuICB9XG5cbiAgaGFuZGxlUmVzdWx0cyA9IChldmVudCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25SZXN1bHRzKGV2ZW50KVxuICB9XG5cbiAgaGFuZGxlUmVzdWx0ID0gKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyByZXN1bHQgfSA9IGV2ZW50XG4gICAgY29uc3QgeyBtYXBSZWYsIG9uVmlld3BvcnRDaGFuZ2UsIG9uUmVzdWx0IH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgeyBpZCwgYmJveCwgY2VudGVyIH0gPSByZXN1bHRcbiAgICBjb25zdCBbbG9uZ2l0dWRlLCBsYXRpdHVkZV0gPSBjZW50ZXJcbiAgICBjb25zdCBiYm94RXhjZXB0aW9ucyA9IHtcbiAgICAgICdjb3VudHJ5LjMxNDgnOiB7XG4gICAgICAgIG5hbWU6ICdGcmFuY2UnLFxuICAgICAgICBiYm94OiBbWy00LjU5MjM1LCA0MS4zODAwMDddLCBbOS41NjAwMTYsIDUxLjE0ODUwNl1dXG4gICAgICB9LFxuICAgICAgJ2NvdW50cnkuMzE0NSc6IHtcbiAgICAgICAgbmFtZTogJ1VuaXRlZCBTdGF0ZXMnLFxuICAgICAgICBiYm94OiBbWy0xNzEuNzkxMTExLCAxOC45MTYxOV0sIFstNjYuOTY0NjYsIDcxLjM1Nzc2NF1dXG4gICAgICB9LFxuICAgICAgJ2NvdW50cnkuMzMwJzoge1xuICAgICAgICBuYW1lOiAnUnVzc2lhJyxcbiAgICAgICAgYmJveDogW1sxOS42NjA2NCwgNDEuMTUxNDE2XSwgWzE5MC4xMDA0MiwgODEuMjUwNF1dXG4gICAgICB9LFxuICAgICAgJ2NvdW50cnkuMzE3OSc6IHtcbiAgICAgICAgbmFtZTogJ0NhbmFkYScsXG4gICAgICAgIGJib3g6IFtbLTE0MC45OTc3OCwgNDEuNjc1MTA1XSwgWy01Mi42NDgwOTksIDgzLjIzMzI0XV1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgd2lkdGggPSBtYXBSZWYuY3VycmVudC5wcm9wcy53aWR0aFxuICAgIGNvbnN0IGhlaWdodCA9IG1hcFJlZi5jdXJyZW50LnByb3BzLmhlaWdodFxuICAgIGxldCB6b29tID0gdGhpcy5nZW9jb2Rlci5vcHRpb25zLnpvb21cblxuICAgIGlmICghYmJveEV4Y2VwdGlvbnNbaWRdICYmIGJib3gpIHtcbiAgICAgIHpvb20gPSBmaXRCb3VuZHMoW1tiYm94WzBdLCBiYm94WzFdXSwgW2Jib3hbMl0sIGJib3hbM11dXSwgeyB3aWR0aCwgaGVpZ2h0IH0pLnpvb21cbiAgICB9IGVsc2UgaWYgKGJib3hFeGNlcHRpb25zW2lkXSkge1xuICAgICAgem9vbSA9IGZpdEJvdW5kcyhiYm94RXhjZXB0aW9uc1tpZF0uYmJveCwgeyB3aWR0aCwgaGVpZ2h0IH0pLnpvb21cbiAgICB9XG5cbiAgICBpZiAodGhpcy5nZW9jb2Rlci5vcHRpb25zLmZseVRvKSB7XG4gICAgICBvblZpZXdwb3J0Q2hhbmdlKHtcbiAgICAgICAgbG9uZ2l0dWRlLFxuICAgICAgICBsYXRpdHVkZSxcbiAgICAgICAgem9vbSxcbiAgICAgICAgdHJhbnNpdGlvbkludGVycG9sYXRvcjogbmV3IEZseVRvSW50ZXJwb2xhdG9yKCksXG4gICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMzAwMFxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgb25WaWV3cG9ydENoYW5nZSh7IGxvbmdpdHVkZSwgbGF0aXR1ZGUsIHpvb20gfSlcbiAgICB9XG5cbiAgICBvblJlc3VsdChldmVudClcblxuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnBsYWNlX25hbWUpIHtcbiAgICAgIHRoaXMuY2FjaGVkUmVzdWx0ID0gcmVzdWx0LnBsYWNlX25hbWVcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFcnJvciA9IChldmVudCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25FcnJvcihldmVudClcbiAgfVxuXG4gIGdldEdlb2NvZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmdlb2NvZGVyXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbWFwUmVmOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29udGFpbmVyUmVmOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uVmlld3BvcnRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbWFwYm94QXBpQWNjZXNzVG9rZW46IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgem9vbTogUHJvcFR5cGVzLm51bWJlcixcbiAgICBmbHlUbzogUHJvcFR5cGVzLmJvb2wsXG4gICAgcGxhY2Vob2xkZXI6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgcHJveGltaXR5OiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIHRyYWNrUHJveGltaXR5OiBQcm9wVHlwZXMuYm9vbCxcbiAgICBiYm94OiBQcm9wVHlwZXMuYXJyYXksXG4gICAgdHlwZXM6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY291bnRyeTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBtaW5MZW5ndGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbGltaXQ6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgbGFuZ3VhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgZmlsdGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBsb2NhbEdlb2NvZGVyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBwb3NpdGlvbjogUHJvcFR5cGVzLm9uZU9mKFZBTElEX1BPU0lUSU9OUyksXG4gICAgb25Jbml0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNsZWFyOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkxvYWRpbmc6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uUmVzdWx0czogUHJvcFR5cGVzLmZ1bmMsXG4gICAgb25SZXN1bHQ6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uRXJyb3I6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9wdGlvbnM6IFByb3BUeXBlcy5vYmplY3QgLy8gZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHYyXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG1hcGJveEFwaUFjY2Vzc1Rva2VuOiBnZXRBY2Nlc3NUb2tlbigpLFxuICAgIHpvb206IDE2LFxuICAgIGZseVRvOiB0cnVlLFxuICAgIHBsYWNlaG9sZGVyOiAnU2VhcmNoJyxcbiAgICB0cmFja1Byb3hpbWl0eTogZmFsc2UsXG4gICAgbWluTGVuZ3RoOiAyLFxuICAgIGxpbWl0OiA1LFxuICAgIHBvc2l0aW9uOiAndG9wLXJpZ2h0JyxcbiAgICBvbkluaXQ6ICgpID0+IHt9LFxuICAgIG9uQ2xlYXI6ICgpID0+IHt9LFxuICAgIG9uTG9hZGluZzogKCkgPT4ge30sXG4gICAgb25SZXN1bHRzOiAoKSA9PiB7fSxcbiAgICBvblJlc3VsdDogKCkgPT4ge30sXG4gICAgb25FcnJvcjogKCkgPT4ge31cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW9jb2RlclxuIl19