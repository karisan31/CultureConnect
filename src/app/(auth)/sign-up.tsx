import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { supabase } from "@/config/initSupabase";
import Spinner from "react-native-loading-spinner-overlay";
import { Link, Stack } from "expo-router";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("jpunia93@outlook.com");
  const [password, setPassword] = useState("thisisatest");
  const [firstName, setFirstName] = useState("Test");
  const [secondName, setSecondName] = useState("Tester");
  const [bio, setBio] = useState("I am testing this");

  //Sign up with personal details
  const onSignUpPress = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert("Error signing up", error.message);
    else Alert.alert("Sign up successful");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Stack.Screen options={{ title: "Sign up" }} />
      <Text style={styles.label}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Input your name here..."
        style={styles.input}
      />
      <Text style={styles.label}>Second Name</Text>
      <TextInput
        value={secondName}
        onChangeText={setSecondName}
        placeholder="Input your surname here..."
        style={styles.input}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Input your bio here..."
        style={styles.input}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button onPress={onSignUpPress} text="Create account" />
      <Link href="/sign-in" style={styles.textButton}>
        Sign in
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "gray",
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  button: {
    marginVertical: 10,
    width: "100%",
    backgroundColor: "blue",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  Image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "grey",
  },
});

export default SignUpScreen;
