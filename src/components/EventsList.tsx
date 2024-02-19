import { StyleSheet, Text, View, Image, Button } from "react-native";
import Colors from "../constants/Colors";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

async function fetchEvents() {
  const { data, error } = await supabase.from("events").select("*");
  console.log(data);
  console.log(error);
}

export default function EventsList() {
  const [eventsData, setEventsData] = useState({});
  fetchEvents();
  return (
    <View>
      <Text>EventsList</Text>
    </View>
  );
}
