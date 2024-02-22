import { useCallback, useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {
  DatePickerInput,
  TimePickerModal,
  enGB,
  registerTranslation,
} from "react-native-paper-dates";
registerTranslation("en-GB", enGB);
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "@/src/components/Themed";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [maxAttendees, setMaxAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hostId, setHostId] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [timeHours, setTimeHours] = useState<number>(12)
  const [timeMinutes, setTimeMinutes] = useState<number>(15)

  const handleSubmit = () => {
    console.log(title)
    console.log(location)
    console.log(date)
    console.log(timeHours)
    console.log(timeMinutes)
  }
  // supabase
  //   .from("events")
  //   .insert([{ title: title, location: location, date: date, host_id: hostId }])
  //   .select();

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      setTimeHours(hours);
      if(minutes<1){
        setTimeMinutes(0)
      } else{
        setTimeMinutes(minutes);
      }
      console.log({ hours, minutes });
    },
    [setVisible]
  );

  const onDateChange = useCallback((dateData: Date | undefined) => {
    setInputDate(dateData);
    setDate(dateData);
  }, [setInputDate, setDate]);

  return (
    <View style={styles.container}>
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

      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
          maxHeight: "10%",
          backgroundColor: "transparent",
        }}
      >
        <DatePickerInput
          withDateFormatInLabel={false}
          presentationStyle="pageSheet"
          locale="en-GB"
          placeholder="DD/MM/YYYY"
          value={inputDate}
          onChange={onDateChange}
          inputMode="start"
          style={{ width: 200 }}
          mode="outlined"
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
          maxHeight: "10%",
          backgroundColor: "transparent",
        }}
      >
        <Button
          onPress={() => setVisible(true)}
          uppercase={false}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        >
          Pick time
        </Button>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        />
        <Text>{timeHours}:{timeMinutes === 0 ? '00' : timeMinutes}</Text>
      </View>
      <Button children="Submit" mode="outlined" style={{ backgroundColor: "white" }} onPress={handleSubmit}></Button>
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
