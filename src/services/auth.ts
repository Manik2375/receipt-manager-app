import { account, databases } from "../lib/appwrite";
import { AppwriteException, ID, OAuthProvider } from "react-native-appwrite";

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
      await account.create(ID.unique(), email, password);
      // await databases.createDocument(DATABASE_ID, "users", ID.unique(), {
      //   name: "test",
      //   email: email,
      // });
    } catch (error: unknown) {
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

      const loginUrl = await account.createOAuth2Token(
        OAuthProvider.Google,
        deepLink.toString(),
        deepLink.toString()
      );

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

        await account.createSession(userId, secret);
      } else {
        console.log("Login canceled or failed:", result);
      }
    } catch (error) {
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },

  async logIn({ email, password }: { email: string; password: string }) {
    try {
      console.log("Logging ", email);
      await account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },
};

export default authService;
