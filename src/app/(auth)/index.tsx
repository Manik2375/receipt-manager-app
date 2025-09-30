import { Alert, Pressable, StyleSheet, TextInput, Image } from "react-native";
import { Text, View } from "react-native";
import { useState } from "react";
import { z } from "zod";
import { account } from "@/src/lib/appwrite";

import authService from "@/src/services/auth";
import { Redirect } from "expo-router";
import { useEffect } from "react";

const SignUpSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function TabOneScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    checkAuthStatus();
  }, [isLoggedIn]);

  async function checkAuthStatus() {
    try {
      setLoading(true);
      await authService.getUserID();
      setIsLoggedIn(true);
    } catch (error) {
      console.log(String(error));
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  const loginHandler = async () => {
    try {
      setLoading(true);
      await authService.oAuthLogin();
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert("error", String(error));
    } finally {
      setLoading(false);
    }
  };

  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");

  // const handleSignUp = async () => {
  //   const formTest = SignUpSchema.safeParse({ email, password });

  //   if (!formTest.success) {
  //     const error = z.prettifyError(formTest.error);
  //     Alert.alert("Error", error);
  //     return;
  //   }

  //   try {
  //     await authService.signUp({ email, password });
  //     Alert.alert("Logged in ");
  //   } catch (error) {
  //     Alert.alert("Problem signing up", String(error));
  //     console.log(error);
  //   }
  // };

  if (isLoggedIn) {
    return <Redirect href="/(main)" />;
  }

  return (
    <View style={styles.container}>
      {/* <TextInput
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
      /> */}
      {/* <Pressable onPress={handleSignUp}>
        <Text style={styles.btn}>Sign up</Text>
      </Pressable> */}
      {/* <Pressable
        onPress={async () => {
          try {
            await account.deleteSession("current");
            Alert.alert("Logged out successfully", "yay");
          } catch (error) {
            console.log("Logout error:", error);
          }
        }}
      >
        <Text style={styles.btn}>Log Out</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          try {
            console.log(await account.get());
            console.log("SESSION", await account.getSession("current"));
          } catch (error) {
            console.log("Error getting user data", error);
          }
        }}
      >
        <Text style={styles.btn}>Get current account details</Text> 
       </Pressable> */}
      <View
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        <Image
          source={require("../../../assets/images/logo.jpeg")}
          resizeMode="contain"
          style={{
            width: 200,
            height: 200,
            marginInline: "auto",
            borderRadius: 50,
          }}
        />
        <View>
          <Text style={styles.specialTxt}>- Manage your warranty slips</Text>
          <Text style={styles.specialTxt}>- Backup everything in cloud</Text>
        </View>
      </View>
      <Pressable onPress={loginHandler}>
        <Text style={styles.btn}>
          {loading ? "Loading...." : "Sign up using google"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    width: "90%",
    borderWidth: 1,
    padding: 10,
  },
  btn: {
    fontSize: 25,
    padding: 20,
    backgroundColor: "royalblue",
    borderRadius: 10,
    alignItems: "center",
    color: "white",
    fontWeight: "bold",
    marginTop: 60,
  },
  specialTxt: {
    fontSize: 25,
  },
});
