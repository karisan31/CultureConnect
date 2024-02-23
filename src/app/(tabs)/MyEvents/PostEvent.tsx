import { useCallback, useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationObject, setLocationObject] = useState({
    latitude: "-29.2434067",
    longitude: "-51.1985995",
  });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [maxAttendees, setMaxAttendees] = useState<string | undefined>(
    undefined
  );
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [hostId, setHostId] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [timeHours, setTimeHours] = useState<number>(12);
  const [timeMinutes, setTimeMinutes] = useState<number>(15);
  const [file, setFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = () => {
    setIsError(false);
    supabase.auth
      .getUser()
      .then((user) => {
        setHostId(user.data.user?.id);
        return uploadImage();
      })
      .then((imagePath) => {
        date?.setHours(timeHours);
        date?.setMinutes(date.getMinutes() + timeMinutes);
        if (isNaN(Number(maxAttendees))) {
          setMaxAttendees(undefined);
        }
        if (description?.length === 0) {
          setDescription(undefined);
        }
        if (imagePath?.length === 0) {
          setImage(undefined);
        } else {
          setImage(imagePath);
        }
      })
      .then(() => {
        const newEvent = {
          title: title,
          location: locationObject,
          date: date,
          host_id: hostId,
          max_attendees: maxAttendees,
          description: description,
          image: image,
        };
        return supabase.from("events").insert([newEvent]).select();
      })
      .then((result) => {
        console.log(result);
        if (result.error) {
          setIsError(true);
        } else {
          router.navigate("/MyEvents/MyEvents");
        }
      });
  };

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      setTimeHours(hours);
      if (minutes < 1) {
        setTimeMinutes(0);
      } else {
        setTimeMinutes(minutes);
      }
    },
    [setVisible]
  );

  const onDateChange = useCallback(
    (dateData: Date | undefined) => {
      setInputDate(dateData);
      setDate(dateData);
    },
    [setInputDate, setDate]
  );

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
      .from("event_images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
            roll permission to upload images.`
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setFile(result.assets[0].uri);
        setError(null);
      }
    }
  };

  return (
    <View style={[styles.container, { display: "flex" }]}>
      <Spinner visible={loading} />

      <Text style={[styles.header, { margin: 5 }]}>Host an Event!</Text>
      {isError ? (
        <Text style={[styles.label, { color: "red" }]}>
          Ensure all required fields are completed!
        </Text>
      ) : null}
      <Text style={[styles.label, { color: "pink" }]}>
        Title, location, date, and time are required.
      </Text>
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
          flex: 1,
          flexDirection: "row",
          backgroundColor: "transparent",
          maxHeight: 70,
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
          style={{ width: 180 }}
          mode="outlined"
        />
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text style={{ marginBottom: 5, marginTop: 5 }}>
            {timeHours}:{timeMinutes === 0 ? "00" : timeMinutes}
          </Text>
          <Button
            onPress={() => setVisible(true)}
            uppercase={false}
            mode="outlined"
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              height: 40,
            }}
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
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View>
          <TextInput
            placeholder="Max attendees"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            mode="outlined"
            style={{ width: 150 }}
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            mode="outlined"
            style={{
              marginTop: 5,
              height: 200,
              maxWidth: 150,
              overflow: "scroll",
            }}
          />
        </View>

        <View style={styles.container}>
          {file ? (
            <View style={[styles.imageContainer, { maxWidth: 150 }]}>
              <Image source={{ uri: file }} style={styles.image} />
            </View>
          ) : (
            <Text style={styles.errorText}>{error}</Text>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              { height: 50, width: 150, alignSelf: "flex-end" },
            ]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button
        children="Submit"
        mode="outlined"
        style={{ backgroundColor: "white", bottom: -5 }}
        onPress={handleSubmit}
      ></Button>
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
});
