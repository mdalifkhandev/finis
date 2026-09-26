const fs = require("fs");
const path = require("path");
const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");

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

function addToolsReplaceAttributes(source) {
  let output = source;

  output = output.replace(
    /<meta-data([^>]*android:name="com\.google\.firebase\.messaging\.default_notification_channel_id"[^>]*?)android:value="default"([^>]*?)\/>/,
    '<meta-data$1tools:replace="android:value" android:value="default"$2/>'
  );

  output = output.replace(
    /<meta-data([^>]*android:name="com\.google\.firebase\.messaging\.default_notification_color"[^>]*?)android:resource="@color\/notification_icon_color"([^>]*?)\/>/,
    '<meta-data$1tools:replace="android:resource" android:resource="@color/notification_icon_color"$2/>'
  );

  if (output !== source && !output.includes('xmlns:tools="http://schemas.android.com/tools"')) {
    output = output.replace(
      /<manifest([^>]*)>/,
      '<manifest$1 xmlns:tools="http://schemas.android.com/tools">'
    );
  }

  return output;
}

module.exports = function withFirebaseMessagingManifest(config) {
  config = withAndroidManifest(config, (configWithManifest) => {
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

  config = withDangerousMod(config, [
    "android",
    async (configWithMod) => {
      const androidRoot = configWithMod.modRequest.platformProjectRoot;
      const manifestPaths = [
        path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml"),
        path.join(androidRoot, "app", "src", "debug", "AndroidManifest.xml"),
      ];

      await Promise.all(
        manifestPaths.map(async (manifestPath) => {
          if (!fs.existsSync(manifestPath)) {
            return;
          }

          const current = await fs.promises.readFile(manifestPath, "utf8");
          const updated = addToolsReplaceAttributes(current);

          if (updated !== current) {
            await fs.promises.writeFile(manifestPath, updated);
          }
        })
      );

      return configWithMod;
    },
  ]);

  return config;
};
