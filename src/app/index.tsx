import {
  Alert,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { Text, View, TextInput, ScrollView } from "@/src/components/Themed";

import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [bio, setBio] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [image, setImage] = useState<string | null>(null);

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

    const imageData = await uploadImage();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          second_name: secondName,
          bio: bio,
          avatar_url: imageData,
        },
      },
    });

    if (error) Alert.alert("Error signing up", error.message);
    else Alert.alert("Sign up successful");
    setLoading(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}`;
    const contentType = "image/*";
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
    console.log(error, "error");
  };

  return signIn ? (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Spinner visible={loading} />
      <View>
        <Image
          source={require("../../assets/images/profileCover.png")}
          style={styles.coverImageOne}
        />
        <Image
          source={require("../../assets/images/profileCover.png")}
          style={styles.coverImageTwo}
        />
        <Image
          source={require("../../assets/images/profileCover.png")}
          style={styles.coverImageThree}
        />
      </View>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/CultureConnectLogo.png")}
          style={styles.logo}
        />
        <Text>Email</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Your email here..."
          value={email}
          onChangeText={setEmail}
          style={styles.inputField}
        />
        <Text>Password</Text>
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
          <Text style={{ color: "#fff", fontSize: 20 }}>Sign in</Text>
        </TouchableOpacity>
        <Button onPress={onCreateAccount} title="Create Account"></Button>
      </View>
    </ScrollView>
  ) : (
    <ScrollView contentContainerStyle={styles.createScroll}>
      <Spinner visible={loading} />
      <View style={styles.createContainer}>
        <Image
          source={
            image
              ? { uri: image }
              : require("../../assets/images/defaultProfile.png")
          }
          style={styles.profileImage}
        />
        <Text onPress={pickImage} style={styles.imageUploadButton}>
          Upload Profile Photo
        </Text>
        <Text style={styles.createLabel}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Input your name here..."
          style={styles.createInputField}
        />
        <Text style={styles.createLabel}>Second Name</Text>
        <TextInput
          value={secondName}
          onChangeText={setSecondName}
          placeholder="Input your surname here..."
          style={styles.createInputField}
        />
        <Text style={styles.createLabel}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Input your bio here..."
          style={styles.createInputField}
        />
        <Text style={styles.createLabel}>Email</Text>
        <TextInput
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholder="jon@gmail.com"
          style={styles.createInputField}
        />

        <Text style={styles.createLabel}>Password</Text>
        <TextInput
          autoCapitalize="none"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Password here..."
          style={styles.createInputField}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          onPress={toggleShowPassword}
        />
        <TouchableOpacity onPress={onSignUpPress} style={styles.createButton}>
          <Text style={{ color: "#fff" }}>Sign Up</Text>
        </TouchableOpacity>
        <Button onPress={onCreateAccount} title="Login"></Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    height: "100%",
  },
  createScroll: {
    height: "100%",
  },
  label: {
    color: "white",
  },
  container: {
    flex: 1,
    top: 160,
    backgroundColor: "rgba(255,255,255,0)",
    padding: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
  profileImage: {
    width: 140,
    height: 140,
    alignSelf: "center",
    borderRadius: 85,
  },
  createLabel: {
    color: "gray",
  },
  createContainer: {
    flex: 1,
    top: 50,
    backgroundColor: "rgba(255,255,255,0)",
    padding: 20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  createInputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
  },
  createButton: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
  imageUploadButton: {
    margin: 10,
    alignSelf: "center",
    fontWeight: "bold",
  },
  coverImageOne: {
    width: 700,
    height: 500,
    top: -350,
    left: 150,
    borderRadius: 280,
  },
  coverImageTwo: {
    width: 200,
    height: 200,
    top: -260,
    right: 80,
    transform: [{ scaleX: -1 }],
    borderRadius: 100,
  },
  coverImageThree: {
    width: 700,
    height: 500,
    left: -50,
    transform: [{ scaleX: -1 }, { rotate: "90deg" }],
    borderRadius: 1000,
  },
  logo: {
    width: 350,
    height: 35,
    marginBottom: 40,
  },
});

export default Login;
