import { account, tablesDB } from "../lib/appwrite";
import {
  AppwriteException,
  ID,
  OAuthProvider,
  Permission,
  Role,
} from "react-native-appwrite";

import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
if (!DATABASE_ID) {
  console.error("Error no database ID");
  throw new Error("NO DATABASE ID");
}

const authService = {
  async signUp({ email, password }: { email: string; password: string }) {
    try {
      const name = email.split("@")[0];
      const userID = ID.unique();
      await account.create({
        userId: userID,
        email,
        password,
        name,
      });

      await account.createEmailPasswordSession({ email, password });

      await account.createVerification({
        url: `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/verify-email`,
      }); 
      // The action is completed despite the error. Have to work on verificiaton
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: "users",
        rowId: userID,
        data: {
          name,
          email,
        },
        permissions: [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
        ],
      });
    } catch (error: unknown) {
      console.error("Error in signUp service function\n", error);
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },
  async oAuthLogin() {
    try {
      const deepLink = new URL(makeRedirectUri());
      const scheme = `${deepLink.protocol}`;

      console.log("Redirect URI:", deepLink);

      const loginUrl = account.createOAuth2Token({
        provider: OAuthProvider.Google,
        success: deepLink.toString(),
        failure: deepLink.toString(),
      });

      console.log("Login URL:", String(loginUrl));

      const result = await WebBrowser.openAuthSessionAsync(
        String(loginUrl),
        scheme
      );
      if (result.type === "success") {
        const url = new URL(result.url);
        const secret = url.searchParams.get("secret");
        const userId = url.searchParams.get("userId");

        if (!secret || !userId)
          throw new Error("Error logging in, no userID or secret");

        await account.createSession({ userId, secret });

        try {
          await tablesDB.getRow({
            databaseId: DATABASE_ID,
            tableId: "users",
            rowId: userId,
          });
        } catch (error) {
          // currently assuming user not in database
          const accountDetails = await account.get();
          await tablesDB.createRow({
            databaseId: DATABASE_ID,
            tableId: "users",
            rowId: userId,
            data: {
              name: accountDetails.name,
              email: accountDetails.email,
            },
            permissions: [
              Permission.read(Role.user(userId)),
              Permission.write(Role.user(userId)),
              Permission.update(Role.user(userId)),
              Permission.delete(Role.user(userId)),
            ],
          });
        }
      } else {
        console.log("Login canceled or failed:", result);
      }
    } catch (error: unknown) {
      console.error("Error in oAuth Login\n", error);
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },

  async logIn({ email, password }: { email: string; password: string }) {
    try {
      console.log("Logging ", email);
      await account.createEmailPasswordSession({ email, password });
    } catch (error: unknown) {
      console.error("Error in login service function\n", error);
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },
};

export default authService;
