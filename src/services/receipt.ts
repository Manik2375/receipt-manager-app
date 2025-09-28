import { AppwriteException, ID, Permission, Role } from "react-native-appwrite";
import { storage, tablesDB } from "../lib/appwrite";
import authService from "./auth";

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
if (!DATABASE_ID) {
  console.error("Error no database ID");
  throw new Error("NO DATABASE ID");
}

export async function uploadImage(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const fileName = "myImage.jpg";
    const fileType = blob.type;
    const fileSize = blob.size;

    console.log("uploading");
    const res = await storage.createFile({
      bucketId: process.env.EXPO_PUBLIC_BUCKET_ID ?? "",
      fileId: ID.unique(),
      file: {
        name: fileName,
        type: fileType,
        size: fileSize,
        uri: url,
      },
    });
    console.log(res);

    // updateReceiptData(); WIP
  } catch (error: unknown) {
    console.error("Error in uploadImage function\n", error);
    if (typeof error === "object" && error) {
      throw (error as AppwriteException).message;
    } else throw error;
  }
}

export async function addReceiptData({
  name,
  date,
  type,
}: {
  name: string;
  date: string;
  type: string;
}) {
  try {
    const receiptId = ID.unique();
    const userId = await authService.getUserID();

    await tablesDB.createRow({
      databaseId: DATABASE_ID ?? "",
      tableId: "receipt",
      rowId: receiptId,
      data: {
        user: userId,
        name,
        date,
        type,
      },
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
  } catch (error: unknown) {
    console.error("Error in addReceiptData function\n", error);
    if (typeof error === "object" && error) {
      throw (error as AppwriteException).message;
    } else throw error;
  }
}
