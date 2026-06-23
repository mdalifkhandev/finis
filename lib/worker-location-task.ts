import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { updateWorkerLocation } from "@/api/worker/attendance.api";
import { setCurrentAccessToken } from "@/lib/auth-token";

export const WORKER_LOCATION_TASK_NAME = "worker-location-tracking";
const TOKEN_KEY = "token";
const TRACKING_KEY = "worker_location_tracking_active";

const locationTaskOptions: Location.LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 5000,
  distanceInterval: 0,
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: "Finis location sharing",
    notificationBody: "Your location is being shared while you are clocked in.",
    notificationColor: "#1F5577",
    killServiceOnDestroy: false,
  },
};

async function setTrackingFlag(enabled: boolean) {
  if (enabled) {
    await SecureStore.setItemAsync(TRACKING_KEY, "1");
    return;
  }

  await SecureStore.deleteItemAsync(TRACKING_KEY);
}

async function isTrackingEnabled() {
  return (await SecureStore.getItemAsync(TRACKING_KEY)) === "1";
}

async function hydrateAccessToken() {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!token) {
    return null;
  }

  setCurrentAccessToken(token);
  return token;
}

if (Platform.OS !== "web" && !TaskManager.isTaskDefined(WORKER_LOCATION_TASK_NAME)) {
  TaskManager.defineTask(WORKER_LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.log("[WorkerLocationTask] error", error);
      return;
    }

    if (!(await isTrackingEnabled())) {
      return;
    }

    const taskData = data as { locations?: Location.LocationObject[] } | undefined;
    const locations = taskData?.locations ?? [];
    const latestLocation = locations[locations.length - 1];

    if (!latestLocation?.coords) {
      return;
    }

    const token = await hydrateAccessToken();
    if (!token) {
      console.log("[WorkerLocationTask] skipped: missing token");
      return;
    }

    try {
      await updateWorkerLocation({
        lat: latestLocation.coords.latitude,
        lng: latestLocation.coords.longitude,
        eventType: "update",
      });
    } catch (taskError) {
      console.log("[WorkerLocationTask] update failed", taskError);
    }
  });
}

export async function startWorkerLocationTracking() {
  if (Platform.OS === "web") {
    return;
  }

  const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
    WORKER_LOCATION_TASK_NAME,
  );

  if (alreadyStarted) {
    await setTrackingFlag(true);
    return;
  }

  await setTrackingFlag(true);

  try {
    await Location.startLocationUpdatesAsync(
      WORKER_LOCATION_TASK_NAME,
      locationTaskOptions,
    );
  } catch (error) {
    await setTrackingFlag(false);
    throw error;
  }
}

export async function stopWorkerLocationTracking() {
  if (Platform.OS === "web") {
    return;
  }

  await setTrackingFlag(false);

  const alreadyStarted = await Location.hasStartedLocationUpdatesAsync(
    WORKER_LOCATION_TASK_NAME,
  );

  if (!alreadyStarted) {
    return;
  }

  await Location.stopLocationUpdatesAsync(WORKER_LOCATION_TASK_NAME);
}
