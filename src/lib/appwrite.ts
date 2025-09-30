import { Client, TablesDB, Account, Storage} from "react-native-appwrite";

export const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "")
  .setPlatform('com.receipt.manager.com');
    // .setDevKey(process.env.EXPO_PUBLIC_DEV_KEY ?? "")

  
export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);