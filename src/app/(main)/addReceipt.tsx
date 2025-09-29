import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  Pressable,
} from "react-native";
import { StyleSheet } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { addReceiptData, uploadImage } from "@/src/services/receipt";
import { date } from "zod";

export default function addReceiptPage() {
  const [name, setName] = useState("");
  const [endDate, setEndDate] = useState<number>(Date.now());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setEndDate(+selectedDate);
    }
    setShowDatePicker(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (result.canceled) {
      Alert.alert("Error", "Error getting image");
      return;
    }
    const uri = result.assets[0].uri;
    setImage(uri);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Receipt name"
      />
      <View style={styles.btn}>
        <Button
          title="Chose the last date for receipt"
          onPress={() => {
            setShowDatePicker(true);
          }}
        />
      </View>
      <View>
        <Text>Current Date selected:{formatDate(new Date(endDate))}</Text>
      </View>
      <View style={styles.btn}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(endDate)}
          mode="date"
          is24Hour={true}
          onChange={onDateChange}
        />
      )}

      <Pressable
        onPress={async () => {
          try {
            if (!image || !name) {
              Alert.alert("Error", "Add all fields first");
              return;
            }
            const imageId = await uploadImage({ url: image });
            await addReceiptData({
              name: name,
              date: formatDate(new Date()),
              endDate: "22-05-2015",
              imageId,
            });
            Alert.alert("Success", "Receipt added successfully");
            setImage("");
            setName("");
            
          } catch (error) {
            console.log(error);
            Alert.alert("error", String(error));
          }
        }}
      >
        <Text style={styles.btnSpecial}>Add receipt</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  input: {
    height: 40,
    margin: 12,
    marginBottom: 30,
    width: "90%",
    borderWidth: 1,
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  btn: {
    marginBlock: 15,
  },
  btnSpecial: {
    backgroundColor: "royalblue",
    color: "white",
    fontWeight: "bold",
    padding: 20,
    fontSize: 22,
    borderRadius: 10,
    marginInline: "auto"
  },
});
