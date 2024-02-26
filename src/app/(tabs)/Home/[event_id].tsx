import { fetchEventByID } from "@/src/Utils/api";
import { defaultPartyImage } from "@/src/components/EventCard";
import Loading from "@/src/components/Loading";
import { Text, View } from "@/src/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import RemoteImage from "@/src/components/RemoteImage";
import { supabase } from "@/config/initSupabase";

export default function EventDetails() {
  const { event_id } = useLocalSearchParams();
  const [eventData, setEventData] = useState<any | null>(null);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [host, setHost] = useState<string>("");

  useEffect(() => {
    fetchEventByID(event_id).then(({ data, error }) => {
      if (data) {
        setIsLoading(false);
        setEventData(data);
        supabase.from("profiles").select("*");
        console.log(data)
      } else {
        setErr(error);
      }
    });
  }, [event_id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!eventData || !eventData[0]) {
    return <Text>This event is either full or has been deleted!</Text>;
  }

  const eventDate = new Date(eventData[0].date);

  const readableDate = eventDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <>
      <View style={styles.container}>
        <Stack.Screen options={{ title: eventData[0].title }} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{eventData[0].title}</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <RemoteImage
            path={eventData[0].image}
            fallback={defaultPartyImage}
            style={styles.image}
            bucket="event_images"
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Host: </Text>
          <Text> {host}</Text>
          <Text style={styles.title}>Date: </Text>
          <Text> {readableDate}</Text>
          <Text style={styles.title}>Location:</Text>
          <Text> {eventData[0].address}</Text>
          <Text style={styles.title}>
            Maximum attendees: {eventData[0].max_attendees}
          </Text>
          <Text style={styles.title}>Description:</Text>
          <Text> {eventData[0].description}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
  image: {
    width: "95%",
    aspectRatio: 1.5,
    borderRadius: 20,
    marginVertical: 10,
  },
});
