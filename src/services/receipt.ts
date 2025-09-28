import { AppwriteException, ID, Permission, Role } from "react-native-appwrite";
import { storage, tablesDB } from "../lib/appwrite";
import authService from "./auth";

const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
if (!DATABASE_ID) {
  console.error("Error no database ID");
  throw new Error("NO DATABASE ID");
}
const BUCKET_ID = process.env.EXPO_PUBLIC_BUCKET_ID;
if (!BUCKET_ID) {
  console.error("Error no bucket ID");
  throw new Error("NO BUCKET ID");
}

export async function uploadImage({ url }: { url: string }) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const fileName = "myImage.jpg";
    const fileType = blob.type;
    const fileSize = blob.size;

    console.log("uploading");
    const res = await storage.createFile({
      bucketId: BUCKET_ID ?? "",
      fileId: ID.unique(),
      file: {
        name: fileName,
        type: fileType,
        size: fileSize,
        uri: url,
      },
    });
    console.log(res);
    return res.$id;

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
  imageId,
}: {
  name: string;
  date: string;
  type: string;
  imageId: string;
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
        imageId,
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

export async function deleteReceipt({ receiptID }: { receiptID: string }) {
  try {
    const receipt = await tablesDB.getRow({
      databaseId: DATABASE_ID ?? "",
      tableId: "receipt",
      rowId: receiptID,
      queries: [],
    });
    const imageId = receipt.imageId;

    await storage.deleteFile({
      bucketId: BUCKET_ID ?? "",
      fileId: receipt.imageId,
    });
    await tablesDB.deleteRow({
      databaseId: DATABASE_ID ?? "",
      tableId: "receipt",
      rowId: receiptID,
    });

    return { success: true };
  } catch (error) {
    console.error("Error in deleteReceipt function\n", error);
    if (typeof error === "object" && error) {
      throw (error as AppwriteException).message;
    } else throw error;
  }
}
