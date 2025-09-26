import { AppwriteException, ID } from "react-native-appwrite";
import { storage } from "../lib/appwrite";

export async function uploadImage(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const fileName = "myImage.jpg";
    const fileType = blob.type;
    const fileSize = blob.size;

    console.log("uploading")
    const res = await storage.createFile({
        bucketId: process.env.EXPO_PUBLIC_BUCKET_ID ?? "",
        fileId: ID.unique(),
        file: {
            name: fileName,
            type: fileType,
            size: fileSize,
            uri: url
        }
    })
    console.log(res)

    // updateReceiptData(); WIP

  } catch (error: unknown) {
    console.error("Error in uploadImage function\n", error);
    if (typeof error === "object" && error) {
      throw (error as AppwriteException).message;
    } else throw error;
  }
}


export async function updateReceiptData() {
    try {
        
    } catch (error) {
        
    }
}