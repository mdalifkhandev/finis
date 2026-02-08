export function generateMapHTML(userLat: number, userLng: number) {
  const zone = [
    [userLat + 0.00045, userLng - 0.00045],
    [userLat + 0.00045, userLng + 0.00045],
    [userLat - 0.00045, userLng + 0.00045],
    [userLat - 0.00045, userLng - 0.00045],
  ];

  const workerLat = userLat - 0.00012;
  const workerLng = userLng + 0.00008;

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
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map("map", {
        zoomControl: true,
        attributionControl: false,
      }).setView([${userLat}, ${userLng}], 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const zone = L.polygon(${JSON.stringify(zone)}, {
        color: "#2F7CF6",
        weight: 2,
        dashArray: "6 4",
        fillColor: "#2F7CF6",
        fillOpacity: 0.16,
      }).addTo(map);

      L.circleMarker([${workerLat}, ${workerLng}], {
        radius: 7,
        color: "#0b9d62",
        fillColor: "#10b981",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);

      L.circleMarker([${userLat}, ${userLng}], {
        radius: 8,
        color: "#1e40af",
        fillColor: "#3b82f6",
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);

      map.fitBounds(zone.getBounds(), { padding: [35, 35] });
    </script>
  </body>
</html>`;
}
