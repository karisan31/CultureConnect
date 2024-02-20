import {
  Alert,
  View,
  Button,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("Test");
  const [secondName, setSecondName] = useState("Tester");
  const [bio, setBio] = useState("I am testing this");
  const [signIn, setSignIn] = useState(true);

  const onSignInPress = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Error signing in", error.message);
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onCreateAccount = () => {
    setSignIn(!signIn);
  };
  const onSignUpPress = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          second_name: secondName,
          bio: bio,
        },
      },
    });

    if (error) Alert.alert("Error signing up", error.message);
    else Alert.alert("Sign up successful");
    setLoading(false);
  };

  return signIn ? (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <Text style={styles.header}>Culture Connect</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        autoCapitalize="none"
        placeholder="Your email here..."
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        placeholder="Password here..."
        style={styles.inputField}
      />
      <MaterialCommunityIcons
        name={showPassword ? "eye-off" : "eye"}
        size={24}
        color="#aaa"
        onPress={toggleShowPassword}
      />
      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={{ color: "#fff" }}>Sign in</Text>
      </TouchableOpacity>
      <Button
        onPress={onCreateAccount}
        title="Create Account"
        style={{ color: "#fff", backgroundColor: "#151515" }}
      ></Button>
    </View>
  ) : (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Text style={styles.label}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Input your name here..."
        style={styles.inputField}
      />
      <Text style={styles.label}>Second Name</Text>
      <TextInput
        value={secondName}
        onChangeText={setSecondName}
        placeholder="Input your surname here..."
        style={styles.inputField}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Input your bio here..."
        style={styles.inputField}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.inputField}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        placeholder="Password here..."
        style={styles.inputField}
      />
      <MaterialCommunityIcons
        name={showPassword ? "eye-off" : "eye"}
        size={24}
        color="#aaa"
        onPress={toggleShowPassword}
      />
      <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
        <Text style={{ color: "#fff" }}>Sign Up</Text>
      </TouchableOpacity>
      <Button onPress={onCreateAccount} title="Login"></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "gray",
  },
  container: {
    flex: 1,
    paddingTop: 200,
    padding: 20,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
    color: "#fff",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
    color: "#fff",
    backgroundColor: "#363636",
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
});

export default Login;
