import { Alert, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useState } from "react";
import { z } from "zod";

import authService from "@/src/services/auth";

const SignUpSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function TabOneScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp = async () => {
    const formTest = SignUpSchema.safeParse({ email, password });

    if (!formTest.success) {
      const error = z.prettifyError(formTest.error);
      Alert.alert("Error", error);
      return;
    }

    try {
      await authService.signUp({ email, password });
    } catch (error) {
      Alert.alert("Problem signing up", String(error));
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Pressable onPress={handleSignUp}>
        <Text style={styles.btn}>Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    width: "90%",
    borderWidth: 1,
    padding: 10,
  },
  btn: {
    padding: 10,
    backgroundColor: "royalblue",
    borderRadius: 10,
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
  },
});
