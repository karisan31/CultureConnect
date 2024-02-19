import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { Link, Stack } from "expo-router";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [bio, setBio] = useState("");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign up" }} />
      <TouchableOpacity>
        <Image
          source={{ uri }}
          style={[
            styles.Image,
            aviOnly && { height: 35, width: 35, borderWidth: 0 },
            imgStyle,
          ]}
        />
        {!aviOnly && (
          <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={30}
              color={"orange"}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Input your name here..."
        style={styles.input}
        secureTextEntry
      />
      <Text style={styles.label}>Second Name</Text>
      <TextInput
        value={secondName}
        onChangeText={setSecondName}
        placeholder="Input your surname here..."
        style={styles.input}
        secureTextEntry
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Input your surname here..."
        style={styles.input}
        secureTextEntry
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

      <Button text="Create account" />
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
