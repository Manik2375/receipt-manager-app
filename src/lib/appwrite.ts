import { Client, Databases, Account } from "react-native-appwrite";

export const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "")
  .setDevKey(process.env.EXPO_PUBLIC_DEV_KEY ?? "")
  .setPlatform('com.receipt.manager.com');


export const account = new Account(client);
export const databases = new Databases(client);
