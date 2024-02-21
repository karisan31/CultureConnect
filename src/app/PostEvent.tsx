import { useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { Text, View } from "../components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);

  supabase
    .from("events")
    .insert([{ title: title, location: location, date: date, host_id: hostId }])
    .select();

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <Text style={styles.header}>Host an Event!</Text>
      
    </View>
  );
}

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
