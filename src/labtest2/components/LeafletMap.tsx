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

// CartoDB tiles — free, no API key, powered by OpenStreetMap data
const LIGHT = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png';
const DARK  = 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png';
const ATTR  = '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO';

function buildHTML(lat: number, lon: number, isDark: boolean, title: string): string {
    const tiles  = isDark ? DARK : LIGHT;
    const bgColor = isDark ? '#1a1a2e' : '#e8e0d8';

    // Escape title for safe JS injection
    const safeTitle = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

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

    var lightLayer = L.tileLayer('${LIGHT}', { attribution: '${ATTR}', maxZoom: 19 });
    var darkLayer  = L.tileLayer('${DARK}',  { attribution: '${ATTR}', maxZoom: 19 });
    var currentLayer = ${isDark} ? darkLayer : lightLayer;
    currentLayer.addTo(map);

    var dotIcon = L.divIcon({
      html: '<div style="width:16px;height:16px;background:#007AFF;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>',
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -12]
    });

    var marker = L.marker([${lat}, ${lon}], { icon: dotIcon }).addTo(map);
    ${safeTitle ? `marker.bindPopup('${safeTitle}');` : ''}

    window.moveMap = function(lat, lon, name) {
      map.flyTo([lat, lon], 13, { animate: true, duration: 0.8 });
      marker.setLatLng([lat, lon]);
      if (name) marker.bindPopup(name).openPopup();
    };

    window.setMapTheme = function(isDark) {
      map.removeLayer(currentLayer);
      currentLayer = isDark ? darkLayer : lightLayer;
      currentLayer.addTo(map);
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
