import { StyleSheet, Button, Image, Alert } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { addReceiptData, uploadImage } from '@/src/services/receipt';

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
      await uploadImage(uri);
      await addReceiptData({
        name: "testing", 
        date: "22-05-2005",
        type: "electronics"
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
