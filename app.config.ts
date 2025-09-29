import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "receipt-tracker",
  slug: "receipt-tracker",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/logo.jpeg",
  scheme: `appwrite-callback-${
    process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  }`,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/logo.jpeg",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/logo.jpeg",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/logo.jpeg",
  },
  plugins: [
    "expo-router",
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
