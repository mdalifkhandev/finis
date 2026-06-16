const { withAndroidManifest } = require("@expo/config-plugins");

const CHANNEL_ID = "com.google.firebase.messaging.default_notification_channel_id";
const CHANNEL_COLOR = "com.google.firebase.messaging.default_notification_color";

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

function findMetaData(application, name) {
  return ensureArray(application["meta-data"]).find(
    (item) => item?.$?.["android:name"] === name
  );
}

module.exports = function withFirebaseMessagingManifest(config) {
  return withAndroidManifest(config, (configWithManifest) => {
    const application = configWithManifest.modResults.manifest.application?.[0];

    if (!application) {
      return configWithManifest;
    }

    const channelIdMetaData = findMetaData(application, CHANNEL_ID);
    if (channelIdMetaData) {
      channelIdMetaData.$["tools:replace"] = "android:value";
    }

    const channelColorMetaData = findMetaData(application, CHANNEL_COLOR);
    if (channelColorMetaData) {
      channelColorMetaData.$["tools:replace"] = "android:resource";
    }

    return configWithManifest;
  });
};
