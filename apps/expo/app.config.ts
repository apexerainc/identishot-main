import { ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
  name: "RestorationX",
  slug: "identishot-mobile",
  owner: "maxidentishot",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  version: "2.1.0",
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/eb906afc-2727-4535-b90d-14aa443fce6e",
  },
  // runtimeVersion: "1.0.0",
  assetBundlePatterns: ["**/*"],
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  android: {
    package: "com.maxidentishot.identishotmobile",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    permissions: ["com.google.android.gms.permission.AD_ID"],
  },
  ios: {
    bundleIdentifier: "com.maxidentishot.identishotmobile",
    supportsTablet: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "eb906afc-2727-4535-b90d-14aa443fce6e",
    },
  },
  plugins: [
    [
      "react-native-vision-camera",
      {
        cameraPermissionText:
          "$(PRODUCT_NAME) needs access to the Camera to take photos during the mitigation process.",
      },
    ],
    [
      "expo-tracking-transparency",
      {
        userTrackingPermission:
          "This identifier will be used to deliver personalized ads to you.",
      },
    ],
  ],
};

export default config;
