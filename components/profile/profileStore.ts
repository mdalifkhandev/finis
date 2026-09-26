import { Alert } from "react-native";
import { useSyncExternalStore } from "react";

const defaultAvatarUri = "";

let profileAvatarUri: string = defaultAvatarUri;
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
        "Allow photo access to change the profile image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      profileAvatarUri = result.assets[0].uri;
      notify();
    }
  } catch (error) {
    Alert.alert("Error", "Failed to pick an image.");
  }
}

export function updateProfileAvatar(uri: string) {
  profileAvatarUri = uri;
  notify();
}

