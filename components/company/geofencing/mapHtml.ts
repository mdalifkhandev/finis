export function generateMapHTML(
  userLat: number,
  userLng: number,
  zoneName = "Selected Project",
  zoneSubtext = "",
) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      body {
        background: #eef2f6;
      }
      .leaflet-control-zoom {
        transform: scale(0.9);
        transform-origin: top right;
      }
      .leaflet-tile-pane {
        filter: saturate(0.78) brightness(1.04);
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
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div class="project-card">
      <div class="eyebrow">Selected Project</div>
      <div class="title">${zoneName}</div>
      ${zoneSubtext ? `<div class="sub">${zoneSubtext}</div>` : ""}
    </div>
    <div class="controls">
      <button id="zoomIn">+</button>
      <button id="zoomOut">−</button>
      <button id="recenter">⌖</button>
    </div>
    <div class="hint">Tap the map to add zone points. Use Save zone when you finish.</div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map("map", {
        zoomControl: true,
        attributionControl: false,
      }).setView([${userLat}, ${userLng}], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const points = [];
      let polygon = null;
      const markers = [];

      function notifyPoints() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'polygon_change',
            polygonCoords: points,
          }));
        }
      }

      function redraw() {
        if (polygon) polygon.remove();
        markers.forEach((marker) => marker.remove());
        markers.length = 0;

        if (points.length >= 2) {
          polygon = L.polygon(points.map((p) => [p.lat, p.lng]), {
            color: "#2F7CF6",
            weight: 3,
            dashArray: "6 4",
            fillColor: "#2F7CF6",
            fillOpacity: 0.16,
          }).addTo(map);
          map.fitBounds(polygon.getBounds(), { padding: [35, 35] });
        }

        points.forEach((point) => {
          markers.push(L.circleMarker([point.lat, point.lng], {
            radius: 5,
            color: "#1d4f6d",
            fillColor: "#3b82f6",
            fillOpacity: 1,
            weight: 2,
          }).addTo(map));
        });
        notifyPoints();
      }

      map.on("click", function (event) {
        points.push({ lat: event.latlng.lat, lng: event.latlng.lng });
        redraw();
      });

      L.circleMarker([${userLat}, ${userLng}], {
        radius: 8,
        color: "#1e40af",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);

      map.setView([${userLat}, ${userLng}], 17);

      document.getElementById("zoomIn").addEventListener("click", function () {
        map.zoomIn();
      });
      document.getElementById("zoomOut").addEventListener("click", function () {
        map.zoomOut();
      });
      document.getElementById("recenter").addEventListener("click", function () {
        if (polygon) {
          map.fitBounds(polygon.getBounds(), { padding: [35, 35] });
        } else {
          map.setView([${userLat}, ${userLng}], 17);
        }
      });
    </script>
  </body>
</html>`;
}
