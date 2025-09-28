import { StyleSheet, Button, Image, Alert } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { addReceiptData, uploadImage, deleteReceipt, getReceiptsForUser, updateReceiptData } from '@/src/services/receipt';

export default function TabTwoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if(result.canceled) {
      Alert.alert("Error", "Error getting image");
      return;
    }
    const uri = result.assets[0].uri;
    setImage(uri);

    try {
      const imageId = await uploadImage({url: uri});
      await addReceiptData({
        name: "testing", 
        date: "22-05-2005",
        endDate: "22-05-2015",
        imageId
      })
    } catch (error) {
      console.log(error);
      Alert.alert("error", String(error));
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploading files</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Get receipt from users" onPress={() => {
        updateReceiptData({
          receiptId: "68d93ba3001b23b044a1",
          name: "pokemon",
          endDate: "20-2-2002"
        })
      }} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
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
});
