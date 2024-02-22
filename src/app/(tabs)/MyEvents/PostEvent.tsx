import { useCallback, useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/config/initSupabase";
import { StyleSheet, ScrollView, Image, TouchableOpacity, Alert} from "react-native";
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

export default function PostEvent() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationObject, setLocationObject]= useState({
    "latitude": "-29.2434067",
    "longitude": "-51.1985995"
  })
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [maxAttendees, setMaxAttendees] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [hostId, setHostId] = useState<String | undefined>("");
  const [loading, setLoading] = useState(false);
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [visible, setVisible] = useState<boolean>(false);
  const [timeHours, setTimeHours] = useState<number>(12)
  const [timeMinutes, setTimeMinutes] = useState<number>(15)
  const [file, setFile] = useState(null); 
  const [error, setError] = useState(null); 



  const handleSubmit = () => {

     supabase.auth.getUser().then((user)=>{
      setHostId(user.data.user?.id)
      date?.setHours(timeHours);
      date?.setMinutes(date.getMinutes() + timeMinutes);
      console.log(typeof user.data.user?.id, "<---")
    })
   

    console.log(title)
    console.log(location)
    console.log(date)


    supabase
      .from("events")
      .insert([{ title: title, location: locationObject, date: date, host_id: hostId }])
      .select().then((event)=>{
        console.log(event)
      })
  }

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

  const pickImage = async () => { 
    const { status } = await ImagePicker. 
        requestMediaLibraryPermissionsAsync(); 

    if (status !== "granted") { 

        // If permission is denied, show an alert 
        Alert.alert( 
            "Permission Denied", 
            `Sorry, we need camera  
             roll permission to upload images.` 
        ); 
    } else { 

        // Launch the image library and get 
        // the selected image 
        const result = 
            await ImagePicker.launchImageLibraryAsync(); 

        if (!result.canceled) { 

            // If an image is selected (not cancelled),  
            // update the file state variable 
            setFile(result.uri); 

            // Clear any previous errors 
            setError(null); 
        } 
    } 
}; 

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
          style={{ maxWidth: 200 }}
          mode="outlined"
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
          maxHeight: "15%",
          backgroundColor: "transparent",
        }}
      >
        <Button
          onPress={() => setVisible(true)}
          uppercase={false}
          mode="outlined"
          style={{ backgroundColor: "white", borderRadius: 10 }}
          
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

      <View style={styles.container}> 
            <Text style={styles.header}> 
                Add Image: 
            </Text> 
  
            {/* Button to choose an image */} 
            <TouchableOpacity style={styles.button} 
                onPress={pickImage}> 
                <Text style={styles.buttonText}> 
                    Choose Image 
                </Text> 
            </TouchableOpacity> 
  
            {/* Conditionally render the image  
            or error message */} 
            {file ? ( 
                // Display the selected image 
                <View style={styles.imageContainer}> 
                    <Image source={{ uri: file }} 
                        style={styles.image} /> 
                </View> 
            ) : ( 
                // Display an error message if there's  
                // an error or no image selected 
                <Text style={styles.errorText}>{error}</Text> 
            )} 
        </View> 
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
  }
  , 
    buttonText: { 
        color: "#FFFFFF", 
        fontSize: 16, 
        fontWeight: "bold", 
    }, 
    imageContainer: { 
        borderRadius: 8, 
        marginBottom: 16, 
        shadowColor: "#000000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 4, 
        elevation: 5, 
    }, 
    image: { 
        width: 200, 
        height: 200, 
        borderRadius: 8, 
    }, 
    errorText: { 
        color: "red", 
        marginTop: 16, 
    }, 
});
