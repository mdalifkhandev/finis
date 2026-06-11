const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const { pathToFileURL } = require("url");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    "expo-keep-awake": pathToFileURL(
      path.resolve(__dirname, "shims/expo-keep-awake.ts"),
    ).href,
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
