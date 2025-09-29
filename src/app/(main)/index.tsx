import { StyleSheet, Button, Image, Alert, Pressable, ScrollView } from "react-native";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  addReceiptData,
  uploadImage,
  deleteReceipt,
  getReceiptsForUser,
  updateReceiptData,
} from "@/src/services/receipt";
import { Link, Redirect } from "expo-router";
import { account, storage } from "@/src/lib/appwrite";
import authService from "@/src/services/auth";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MainScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<"yes" | "no" | "pending">(
    "pending"
  );
  const [receipts, setReceipts] = useState<any>(null);
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      await authService.getUserID();
    } catch (error) {
      console.log(String(error));
      setIsLoggedIn("no");
    }
  }

  useEffect(() => {
    const getAllReceipts = async () => {
      try {
        const receipts = await getReceiptsForUser();
        setReceipts(receipts);
      } catch (error) {
        Alert.alert("error", String(error));
      }
    };
    getAllReceipts();
  }, []);
  if (isLoggedIn == "no") {
    return <Redirect href="/(auth)" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.nav}>
        <Pressable
          onPress={async () => {
            try {
              await account.deleteSessions();
              Alert.alert("Logged out successfully", "yay");
              setIsLoggedIn("no");
            } catch (error) {
              console.log("Logout error:", error);
            }
          }}
        >
          <Text style={styles.btn}>Log Out</Text>
        </Pressable>
        <Link href={{ pathname: "./addReceipt" }} style={styles.link}>
          Add item
        </Link>
      </View>
      <View style={styles.separator} />
      <Text style={styles.title}>Your receipts!</Text>

      <View style={styles.cardContainer}>
        {receipts
          ? receipts.map((receipt: any) => {
              return <ReceiptCard receiptData={receipt} key={receipt.$id} />;
            })
          : null}
      </View>
    </ScrollView>
  );
}

const getImageUrl = (imageId: string) => {
  try {
    const bucketId = process.env.EXPO_PUBLIC_BUCKET_ID;
    const res = storage.getFilePreviewURL(bucketId ?? "", imageId);
    console.log(res);
    return res.href;
  } catch (error) {
    console.log("Error getting image URL: ", error);
    return null;
  }
};

function ReceiptCard({ receiptData }: { receiptData: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          {receiptData.name}
        </Text>
        <Text>Ending on: {formatDate(new Date(receiptData.endDate))}</Text>
      </View>
      <View>
        <Image
          source={{ uri: getImageUrl(receiptData.imageId) ?? "" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,

    display: "flex",
    // justifyContent: "center",
    backgroundColor: "white",
    height: "100%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  image: {
    width: 200,
    height: 200,
  },
  link: {
    backgroundColor: "royalblue",
    color: "white",
    fontWeight: "bold",
    padding: 20,
    fontSize: 22,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: "coral",
    color: "white",
    fontWeight: "bold",
    padding: 20,
    fontSize: 22,
    borderRadius: 10,
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContainer: {
    marginTop: 40,
    display: "flex",
    gap: 20,
  },
  card: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 10,
  },
  cardTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
