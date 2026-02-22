const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    "expo-keep-awake": path.resolve(__dirname, "shims/expo-keep-awake.ts"),
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
