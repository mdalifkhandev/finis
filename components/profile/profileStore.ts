import { Alert } from "react-native";
import { useSyncExternalStore } from "react";

const defaultAvatarUri =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop";

let profileAvatarUri = defaultAvatarUri;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => profileAvatarUri;

export function useProfileAvatar() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export async function pickProfileAvatar() {
  try {
    const ImagePicker = await import("expo-image-picker");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Allow photo access to change the profile image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    profileAvatarUri = result.assets[0].uri;
    notify();
  } catch {
    Alert.alert(
      "Unavailable",
      "Image picker is unavailable in this runtime.",
    );
  }
}
