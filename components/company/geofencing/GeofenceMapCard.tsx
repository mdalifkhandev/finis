import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapLegend from "./MapLegend";
import { generateMapHTML } from "./mapHtml";

type DeviceLocation = {
  latitude: number;
  longitude: number;
};

type WebViewModule = typeof import("react-native-webview");

type GeofenceMapCardProps = {
  projectName?: string;
  projectSite?: string;
  selectedProjectId?: string;
  initialPolygonCoords?: Array<{ lat: number; lng: number }>;
  liveWorkers?: Array<{ workerId: string; workerName: string; lat: number; lng: number; isInsideZone?: boolean }>;
  onPolygonChange?: (points: Array<{ lat: number; lng: number }>) => void;
};

export default function GeofenceMapCard({
  projectName,
  projectSite,
  initialPolygonCoords,
  liveWorkers,
  onPolygonChange,
}: GeofenceMapCardProps) {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [locationLabel, setLocationLabel] = useState("Locating your device...");
  const [loading, setLoading] = useState(true);
  const [webViewModule, setWebViewModule] = useState<WebViewModule | null>(
    null,
  );
  const [webViewUnavailable, setWebViewUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    import("react-native-webview")
      .then((module) => {
        if (!active) return;
        setWebViewModule(module);
        setWebViewUnavailable(false);
      })
      .catch(() => {
        if (!active) return;
        setWebViewModule(null);
        setWebViewUnavailable(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadLocation = async () => {
      const Location = await import("expo-location");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!active) return;

      if (status !== "granted") {
        setLocationLabel("Location permission denied");
        setLoading(false);
        return;
      }

      const lastKnown = await Location.getLastKnownPositionAsync({});
      if (active && lastKnown) {
        setLocation({
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        setLocationLabel(
          `${lastKnown.coords.latitude.toFixed(4)}, ${lastKnown.coords.longitude.toFixed(4)}`,
        );
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!active) return;

      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      setLocationLabel(
        `${current.coords.latitude.toFixed(4)}, ${current.coords.longitude.toFixed(4)}`,
      );
      setLoading(false);
    };

    loadLocation().catch(() => {
      if (!active) return;
      setLocationLabel("Unable to fetch location");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const userLat = location?.latitude ?? 23.7808;
  const userLng = location?.longitude ?? 90.4067;
  const WebView = webViewModule?.WebView;

  return (
    <View className="mt-4 px-5">
      <View className="overflow-hidden rounded-2xl border border-[#DEE4EA] bg-white">
        <View className="h-[500px] w-full">
          {loading ? (
            <View className="h-full items-center justify-center bg-[#EEF2F6]">
              <ActivityIndicator size="large" color="#1D5677" />
              <Text className="mt-2 text-[14px] text-[#6B7280]">
                Loading map...
              </Text>
            </View>
          ) : WebView && !webViewUnavailable ? (
            <WebView
              source={{ html: generateMapHTML(userLat, userLng, projectName ?? "Selected Project", projectSite ?? "", initialPolygonCoords ?? [], liveWorkers ?? []) }}
              style={{ flex: 1, backgroundColor: "#EEF2F6" }}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={["*"]}
              scrollEnabled={false}
              onMessage={(event) => {
                try {
                  const payload = JSON.parse(event.nativeEvent.data);
                  if (payload?.type === "polygon_change" && Array.isArray(payload.polygonCoords)) {
                    onPolygonChange?.(payload.polygonCoords);
                  }
                } catch {
                  // ignore invalid messages
                }
              }}
            />
          ) : (
            <View className="h-full items-center justify-center bg-[#EEF2F6] px-6">
              <Text className="text-center text-[14px] text-[#475569]">
                Map preview is unavailable in this runtime.
              </Text>
              <Text className="mt-1 text-center text-[12px] text-[#64748B]">
                Build a dev client to enable WebView map rendering.
              </Text>
            </View>
          )}

          <View className="absolute right-3 top-3 rounded-lg bg-[#0F172A]/80 px-3 py-2">
            <Text className="text-[11px] font-medium text-[#E5E7EB]">GPS</Text>
            <Text className="text-[12px] text-white">{locationLabel}</Text>
          </View>

          
          <MapLegend />
        </View>
      </View>
    </View>
  );
}
