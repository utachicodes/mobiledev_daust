import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Coordinates } from '../types';

export interface LeafletMapRef {
  moveToLocation: (coords: Coordinates, name?: string) => void;
  setTheme: (isDark: boolean) => void;
}

interface Props {
  initialCoords: Coordinates;
  isDark: boolean;
  markerTitle?: string;
}

// CartoDB tiles — free, no API key, OpenStreetMap data
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const DARK_TILES  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO';

function buildHTML(lat: number, lon: number, isDark: boolean, title: string): string {
  const tilesUrl  = isDark ? DARK_TILES : LIGHT_TILES;
  const bgColor   = isDark ? '#1a1a2e' : '#f0f0f0';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body, #map { width:100%; height:100%; background:${bgColor}; }
    .leaflet-control-attribution { font-size: 9px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lon}], 13);

    var lightLayer = L.tileLayer('${LIGHT_TILES}', {
      attribution: '${ATTRIBUTION}', maxZoom: 19, subdomains: 'abcd'
    });
    var darkLayer = L.tileLayer('${DARK_TILES}', {
      attribution: '${ATTRIBUTION}', maxZoom: 19, subdomains: 'abcd'
    });

    var currentLayer = ${isDark} ? darkLayer : lightLayer;
    currentLayer.addTo(map);

    // Custom blue dot marker
    var dotIcon = L.divIcon({
      html: '<div style="width:14px;height:14px;background:#007AFF;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>',
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });

    var marker = L.marker([${lat}, ${lon}], { icon: dotIcon }).addTo(map);
    ${title ? `marker.bindPopup('${title.replace(/'/g, "\\'")}');` : ''}

    window.moveMap = function(lat, lon, name) {
      map.flyTo([lat, lon], 13, { animate: true, duration: 0.8 });
      marker.setLatLng([lat, lon]);
      if (name) { marker.bindPopup(name).openPopup(); }
    };

    window.setMapTheme = function(isDark) {
      map.removeLayer(currentLayer);
      currentLayer = isDark ? darkLayer : lightLayer;
      currentLayer.addTo(map);
      document.body.style.background = isDark ? '#1a1a2e' : '#f0f0f0';
    };
  </script>
</body>
</html>`;
}

const LeafletMap = forwardRef<LeafletMapRef, Props>(
  ({ initialCoords, isDark, markerTitle = '' }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      moveToLocation(coords: Coordinates, name = '') {
        const safe = name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        webViewRef.current?.injectJavaScript(
          `window.moveMap(${coords.latitude}, ${coords.longitude}, '${safe}'); true;`
        );
      },
      setTheme(dark: boolean) {
        webViewRef.current?.injectJavaScript(
          `window.setMapTheme(${dark}); true;`
        );
      },
    }));

    return (
      <WebView
        ref={webViewRef}
        style={StyleSheet.absoluteFillObject}
        source={{ html: buildHTML(initialCoords.latitude, initialCoords.longitude, isDark, markerTitle) }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        mixedContentMode="compatibility"
      />
    );
  }
);

export default LeafletMap;
