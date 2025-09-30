import {
  StyleSheet,
  Button,
  Image,
  Alert,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
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
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [loading, setIsLoading] = useState<boolean>(true);
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
  const getAllReceipts = async () => {
    try {
      setIsLoading(true);
      const receipts = await getReceiptsForUser();
      setReceipts(receipts);
    } catch (error) {
      Alert.alert("error", String(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
              Alert.alert("Logged out successfully", "We hope to see you again!");
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.title}>Your receipts!</Text>
        <Pressable
          onPress={async () => {
            getAllReceipts();
          }}
        >
          <Text
            style={{
              ...styles.btn,
              fontSize: 15,
              padding: 12,
              backgroundColor: "royalblue",
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Text>
        </Pressable>
      </View>

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
    return res.href;
  } catch (error) {
    console.log("Error getting image URL: ", error);
    return null;
  }
};

function ReceiptCard({ receiptData }: { receiptData: any }) {
  const [editMenu, setEditMenu] = useState<boolean>(false);
  const [name, setName] = useState(receiptData.name);
  const [endDate, setEndDate] = useState<number>(receiptData.endDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  function toggleEditMenu() {
    setEditMenu(!editMenu);
  }
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setEndDate(+selectedDate);
    }
    setShowDatePicker(false);
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          {receiptData.name}
        </Text>
        <Text
          style={{
            color: "grey",
          }}
        >
          End date:{" "}
          <Text
            style={{
              fontWeight: 700,
            }}
          >
            {formatDate(new Date(receiptData.endDate))}
          </Text>
        </Text>
      </View>
      <View
        style={{
          borderRadius: 50,
          overflow: "hidden",
          marginTop: 20,
          marginInline: "auto",
        }}
      >
        <Image
          source={{ uri: getImageUrl(receiptData.imageId) ?? "" }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Pressable onPress={toggleEditMenu}>
          <Text
            style={{
              ...styles.btn,
              fontSize: 15,
              padding: 12,
              backgroundColor: "royalblue",
            }}
          >
            {editMenu ? "Close ❌" : "Edit"}
          </Text>
        </Pressable>
        <Pressable
          disabled={deleteLoading}
          onPress={() => {
            Alert.alert(
              "Confirm",
              "Are you sure you want to delete your receipt?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete receipt",
                  onPress: async () => {
                    try {
                      const res = await deleteReceipt({
                        receiptId: receiptData.$id,
                      });
                      if (res.success) {
                        Alert.alert(
                          "Success!",
                          "Receipt Deleted successfully. Refresh the page."
                        );
                      }
                    } catch (error) {
                      Alert.alert(
                        "Error",
                        "Some error occured when deleting the receipt. Please try again later"
                      );
                    }
                  },
                  style: "default",
                },
              ]
            );
          }}
        >
          <Text
            style={{
              ...styles.btn,
              fontSize: 15,
              padding: 12,
              backgroundColor: "royalblue",
            }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Text>
        </Pressable>
      </View>
      {editMenu ? (
        <View
          style={{
            borderColor: "royalblue",
            borderWidth: 2,
            borderStyle: "solid",
            padding: 20,
          }}
        >
          <Text>Edit menu</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Receipt name"
          />
          <View>
            <Text>Current Date selected:{formatDate(new Date(endDate))}</Text>
          </View>
          <View>
            <Button
              title="Update Last date"
              onPress={() => {
                setShowDatePicker(true);
              }}
            />
          </View>
          <Pressable
            disabled={loading}
            onPress={async () => {
              try {
                if (!name || !endDate) {
                  Alert.alert("Error", "Add all fields first");
                  return;
                }
                setLoading(true);
                await updateReceiptData({
                  name,
                  receiptId: receiptData.$id,
                  endDate: formatDate(new Date(endDate)),
                });
                Alert.alert(
                  "Success",
                  "Receipt updated successfully. Refresh the page"
                );
                setEditMenu(false);
              } catch (error) {
                console.log(error);
                Alert.alert("error", String(error));
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text
              style={{
                ...styles.btn,
                marginLeft: "auto",
                backgroundColor: "royalblue",
                marginTop: 20,
                fontSize: 18,
                padding: 10,
              }}
            >
              {loading ? "Updating..." : "Update Receipt"}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(endDate)}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    paddingBottom: 80,

    display: "flex",
    // justifyContent: "center",
    backgroundColor: "white",
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
    width: 300,
    height: 300,
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#F1EEFE",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    gap: 20,
    // boxShadow: "0 0 10 black"
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  input: {
    height: 40,
    margin: 12,
    marginBottom: 30,
    width: "90%",
    borderWidth: 1,
    padding: 10,
  },
});
