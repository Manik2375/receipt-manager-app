import { account } from "../lib/appwrite";
import { AppwriteException, ID } from "react-native-appwrite";

const authService = {
  async signUp({ email, password }: { email: string; password: string }) {
    try {
      await account.create(ID.unique(), email, password);
    } catch (error: unknown) {
      if (typeof error === "object" && error) {
        console.log(
          "Sign Up error:----- \n",
          Object.entries(error),
          "Ending-------"
        );
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },
  async logIn({ email, password }: { email: string; password: string }) {
    try {
      await account.createEmailPasswordSession(email, password);
    } catch (error) {
      if (typeof error === "object" && error) {
        throw (error as AppwriteException).message;
      } else throw error;
    }
  },
};

export default authService;
