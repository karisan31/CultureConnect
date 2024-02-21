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

const PostEvent = async () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, error } = await supabase
    .from("events")
    .insert([{ title: title, location: location, date: date, host_id: hostId }])
    .select();

  return (
    <View style={styles.container}>
        <Spinner visible={loading}/>

        <Text style={styles.header}>Culture Connect</Text>
        
    </View>
  )
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

export default PostEvent;
