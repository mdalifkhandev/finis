function escapeHtml(value: string) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function generateMapHTML(
  userLat: number,
  userLng: number,
  zoneName = "Selected Project",
  zoneSubtext = "",
  initialPolygonCoords: Array<{ lat: number; lng: number }> = [],
  liveWorkers: Array<{
    workerId: string;
    workerName: string;
    lat: number;
    lng: number;
    isInsideZone?: boolean;
  }> = [],
  googleMapsApiKey = "",
) {
  const apiKey = googleMapsApiKey.trim();

  if (!apiKey) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #eef2f6;
      }
      .wrap {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        box-sizing: border-box;
        text-align: center;
        color: #334155;
      }
      .card {
        max-width: 320px;
        background: rgba(255,255,255,0.95);
        border: 1px solid #d7dde4;
        border-radius: 18px;
        padding: 18px 16px;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
      }
      h1 {
        font-size: 18px;
        margin: 0 0 8px;
        color: #0f172a;
      }
      p {
        margin: 0;
        line-height: 1.5;
        font-size: 13px;
      }
      code {
        display: block;
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 10px;
        background: #0f172a;
        color: #e2e8f0;
        font-size: 12px;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>Google Maps API key missing</h1>
        <p>Add <b>EXPO_PUBLIC_GOOGLE_MAPS_API_KEY</b> in <code>.env</code> to enable the geofencing map.</p>
      </div>
    </div>
  </body>
</html>`;
  }

  const initialPointsJson = JSON.stringify(initialPolygonCoords);
  const liveWorkersJson = JSON.stringify(liveWorkers);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        background: #eef2f6;
        overflow: hidden;
        overscroll-behavior: none;
        touch-action: auto;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #map {
        touch-action: auto;
        -ms-touch-action: auto;
      }
      .controls {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .controls button {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid #d7dde4;
        background: white;
        color: #2563eb;
        font-size: 18px;
        font-weight: 700;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
      }
      .draw-controls {
        position: absolute;
        right: 12px;
        top: 60px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .draw-controls button {
        width: 74px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid #d7dde4;
        background: white;
        color: #1f3d5c;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
      }
      .project-card {
        position: absolute;
        left: 12px;
        top: 12px;
        z-index: 9999;
        background: rgba(255,255,255,0.95);
        padding: 10px 12px;
        border-radius: 12px;
        box-shadow: 0 12px 24px rgba(15,23,42,0.12);
        min-width: 128px;
      }
      .project-card .eyebrow {
        font-size: 10px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: .8px;
      }
      .project-card .title {
        font-size: 13px;
        line-height: 1.2;
        font-weight: 700;
        color: #111827;
        margin-top: 2px;
      }
      .project-card .sub {
        font-size: 11px;
        color: #64748b;
        margin-top: 2px;
      }
      .hint {
        position: absolute;
        left: 12px;
        bottom: 12px;
        z-index: 9999;
        background: rgba(15,23,42,0.86);
        color: white;
        font-size: 11px;
        padding: 8px 10px;
        border-radius: 10px;
        max-width: 220px;
      }
      .worker-label {
        background: rgba(255,255,255,0.96);
        border: 1px solid #d7dde4;
        border-radius: 999px;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 700;
        color: #1f2937;
        box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12);
        transform: translateY(-6px);
        white-space: nowrap;
      }
      .status-badge {
        position: absolute;
        left: 12px;
        bottom: 12px;
        z-index: 9999;
        background: rgba(15,23,42,0.85);
        color: #fff;
        font-size: 11px;
        padding: 8px 10px;
        border-radius: 10px;
        max-width: 240px;
      }
      .status-badge strong {
        display: block;
        font-size: 12px;
        margin-bottom: 2px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div class="project-card">
      <div class="eyebrow">Selected Project</div>
      <div class="title">${escapeHtml(zoneName)}</div>
      <div class="sub">${escapeHtml(zoneSubtext || "Tap the map to draw your geofence zone")}</div>
    </div>
    <div class="controls">
      <button id="zoomIn">+</button>
      <button id="zoomOut">−</button>
      <button id="recenter">⌖</button>
    </div>
    <div class="draw-controls">
      <button id="undo">Undo</button>
      <button id="reset">Reset</button>
    </div>
    <div class="status-badge" id="statusBadge">
      <strong>Map ready</strong>
      Tap anywhere to add zone points.
    </div>

    <script>
      function escapeHtml(value) {
        return String(value || "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#39;");
      }
    </script>
    <script>
      window.__INITIAL_POINTS__ = ${initialPointsJson};
      window.__LIVE_WORKERS__ = ${liveWorkersJson};
      window.__CENTER__ = { lat: ${Number(userLat)}, lng: ${Number(userLng)} };
      window.__ZONE_NAME__ = ${JSON.stringify(zoneName)};
      window.__ZONE_SUBTEXT__ = ${JSON.stringify(zoneSubtext)};

      let map;
      let polygon = null;
      let previewLine = null;
      let userMarker = null;
      let statusBadge = null;
      const points = Array.isArray(window.__INITIAL_POINTS__) ? window.__INITIAL_POINTS__.slice() : [];
      let pointMarkers = [];
      let workerMarkers = [];
      let workerInfoWindows = [];

      function postPoints() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'polygon_change',
            polygonCoords: points,
          }));
        }
      }

      function setStatus(title, description) {
        if (!statusBadge) return;
        statusBadge.innerHTML = '<strong>' + title + '</strong>' + (description ? description : '');
      }

      function clearDrawingOverlays() {
        if (polygon) {
          polygon.setMap(null);
          polygon = null;
        }
        if (previewLine) {
          previewLine.setMap(null);
          previewLine = null;
        }
        pointMarkers.forEach((marker) => marker.setMap(null));
        pointMarkers = [];
      }

      function syncPolygon() {
        clearDrawingOverlays();

        if (points.length >= 2) {
          previewLine = new google.maps.Polyline({
            path: points,
            strokeColor: '#2F7CF6',
            strokeOpacity: 0.95,
            strokeWeight: 2,
            icons: [{
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 2,
                strokeColor: '#2F7CF6',
              },
              offset: '0',
              repeat: '24px',
            }],
            map,
          });
        }

        if (points.length >= 3) {
          polygon = new google.maps.Polygon({
            paths: points,
            strokeColor: '#2F7CF6',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#2F7CF6',
            fillOpacity: 0.16,
            map,
          });

          const bounds = new google.maps.LatLngBounds();
          points.forEach((point) => bounds.extend(point));
          map.fitBounds(bounds, 48);
        }

        points.forEach((point, index) => {
          const marker = new google.maps.Marker({
            position: point,
            map,
            draggable: true,
            title: 'Zone point ' + (index + 1),
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#1D4F6D',
              strokeWeight: 2,
              scale: 5,
            },
          });

          marker.addListener('dragend', function (event) {
            points[index] = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            syncPolygon();
            postPoints();
          });

          pointMarkers.push(marker);
        });

        postPoints();
      }

      function clearWorkerOverlays() {
        workerMarkers.forEach((marker) => marker.setMap(null));
        workerInfoWindows.forEach((infoWindow) => infoWindow.close());
        workerMarkers = [];
        workerInfoWindows = [];
      }

      function renderWorkers(workers) {
        clearWorkerOverlays();

        (Array.isArray(workers) ? workers : []).forEach((worker) => {
          const marker = new google.maps.Marker({
            position: { lat: worker.lat, lng: worker.lng },
            map,
            title: worker.workerName,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: worker.isInsideZone ? '#22C55E' : '#EF4444',
              fillOpacity: 1,
              strokeColor: worker.isInsideZone ? '#16A34A' : '#DC2626',
              strokeWeight: 2,
              scale: 8,
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: '<div class="worker-label">' + escapeHtml(worker.workerName) + '</div>',
            disableAutoPan: true,
          });
          infoWindow.open({ map, anchor: marker });

          workerMarkers.push(marker);
          workerInfoWindows.push(infoWindow);
        });
      }

      window.renderLiveWorkers = function (workers) {
        renderWorkers(workers);
      };

      function recenter() {
        map.setCenter(window.__CENTER__);
        map.setZoom(17);
      }

      function initMap() {
        statusBadge = document.getElementById('statusBadge');

        map = new google.maps.Map(document.getElementById('map'), {
          center: window.__CENTER__,
          zoom: 17,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          draggable: true,
          scrollwheel: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          ],
        });

        userMarker = new google.maps.Marker({
          position: window.__CENTER__,
          map,
          title: 'Your location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#1E40AF',
            strokeWeight: 2,
            scale: 8,
          },
        });

        map.addListener('click', function (event) {
          points.push({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
          setStatus('Drawing zone', points.length + ' point(s) selected');
          syncPolygon();
        });

        document.getElementById('undo').addEventListener('click', function () {
          if (points.length === 0) {
            return;
          }
          points.pop();
          setStatus('Undo last point', points.length + ' point(s) selected');
          syncPolygon();
        });

        document.getElementById('reset').addEventListener('click', function () {
          points.length = 0;
          clearDrawingOverlays();
          setStatus('Zone cleared', 'Tap anywhere to start again');
          postPoints();
          recenter();
        });

        document.getElementById('zoomIn').addEventListener('click', function () {
          map.setZoom((map.getZoom() || 17) + 1);
        });

        document.getElementById('zoomOut').addEventListener('click', function () {
          map.setZoom((map.getZoom() || 17) - 1);
        });

        document.getElementById('recenter').addEventListener('click', function () {
          recenter();
        });

        if (points.length > 0) {
          syncPolygon();
        } else {
          postPoints();
        }

        renderWorkers(window.__LIVE_WORKERS__ || []);

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'map_ready',
          }));
        }

        setStatus('Map ready', 'Tap anywhere to add zone points');
      }
    </script>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly"
      async
      defer
    ></script>
  </body>
</html>`;
}
