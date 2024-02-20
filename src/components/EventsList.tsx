import { StyleSheet, Text, View, Image, Button, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { fetchEvents } from "../Utils/api";
import Loading from "./Loading";


export default function EventsList() {
  const [eventsData, setEventsData] = useState({});
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setErr(null)
    fetchEvents().then(({ data, error }) => {
      if (data) {
        setIsLoading(false)
        setEventsData(data);
      } else {
        setErr(error);
      }
    });
  }, []);

  const theme = useColorScheme();

  const textColor = [
    theme === 'dark' ? {color:Colors.dark.text} : {color:Colors.light.text}
  ]


  return (
    <View>
      {isLoading ? (<Loading/>) : <Text style={textColor} > the data</Text> } 
    </View>
    
    
  );
}
