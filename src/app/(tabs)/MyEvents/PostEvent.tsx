import { useCallback, useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { Text, View } from "../../../components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  DatePickerInput,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
registerTranslation("en-GB", enGB);
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [maxAttendees, setMaxAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);

  // supabase
  //   .from("events")
  //   .insert([{ title: title, location: location, date: date, host_id: hostId }])
  //   .select();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Host Event" }} />
      <Spinner visible={loading} />

      <Text style={styles.header}>Host an Event!</Text>

      <Text style={styles.label}>Enter title</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
      />

      <TextInput
        placeholder="City"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
      />

      <SafeAreaProvider>
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
            maxHeight: "30%",
            backgroundColor: "transparent",
          }}
        >
          <DatePickerInput
            withDateFormatInLabel={false}
            presentationStyle="pageSheet"
            locale="en-GB"
            placeholder="DD/MM/YYYY"
            value={inputDate}
            onChange={(newDate) => setInputDate(newDate)}
            inputMode="start"
            style={{ width: 200 }}
            mode="outlined"
          />
        </View>
      </SafeAreaProvider>
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
