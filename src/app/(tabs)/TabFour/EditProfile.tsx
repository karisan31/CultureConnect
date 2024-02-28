import { supabase } from "@/config/initSupabase";
import { Text, TextInput, View } from "@/src/components/Themed";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { useState } from "react";

interface ProfileUpdates {
  first_name?: string;
  second_name?: string;
  bio?: string;
  avatar_url?: string;
}

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [updates, setUpdates] = useState<ProfileUpdates>({});

  const handleUpdateProfile = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user) {
        const updatedData: ProfileUpdates = {};

        if (firstName.trim() !== "") {
          updatedData.first_name = firstName.trim();
        }
        if (secondName.trim() !== "") {
          updatedData.second_name = secondName.trim();
        }
        if (bio.trim() !== "") {
          updatedData.bio = bio.trim();
        }
        if (image) {
          const imageData = await uploadImage();
          updatedData.avatar_url = imageData;
        }

        if (Object.keys(updatedData).length === 0) {
          throw new Error("No data to update");
        }

        console.log("Updating profile with data:", updatedData);

        const { data, error } = await supabase
          .from("profiles")
          .update(updatedData)
          .eq("id", user.data.user?.id);

        if (error) {
          throw error;
        }

        console.log("Profile updated successfully:", data);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      Alert.alert("Error", "Failed to update profile");
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.inputField}
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={styles.label}>Second Name</Text>
      <TextInput
        style={styles.inputField}
        value={secondName}
        onChangeText={setSecondName}
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.inputField}
        multiline
        numberOfLines={4}
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={{ color: "#fff" }}>Choose Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={{ color: "#fff" }}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    color: "gray",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    padding: 20,
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
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
});
