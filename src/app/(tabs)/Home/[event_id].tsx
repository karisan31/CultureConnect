import { fetchEventByID } from "@/src/Utils/api";
import { defaultPartyImage } from "@/src/components/EventCard";
import Loading from "@/src/components/Loading";
import { ScrollView, Text, View } from "@/src/components/Themed";
import { useLocalSearchParams, Stack, router, Link } from "expo-router";
import { useEffect, useState } from "react";
import * as React from "react";
import { StyleSheet } from "react-native";
import RemoteImage from "@/src/components/RemoteImage";
import { supabase } from "@/config/initSupabase";
import { Button } from "react-native-paper";

export default function EventDetails() {
  const { event_id } = useLocalSearchParams();
  const [eventData, setEventData] = useState<any | null>(null);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [host, setHost] = useState<any>({});
  const [hostError, setHostError] = useState<boolean>(false);
  const [isAttending, setIsAttending] = useState<boolean>(false);
  const [attendError, setAttendError] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getUser().then((user: any) => {
      //get the user currently logged in, set currentUser to their user ID
      setCurrentUser(user.data.user?.id);
      //fetch the data for this event
      fetchEventByID(event_id).then(({ data, error }) => {
        if (data) {
          //if there is data not an error, set event data from the database
          setEventData(data);
          //get the event host's info from the database
          supabase
            .from("profiles")
            .select("*")
            .eq("id", data[0].host_id)
            .then((hostData) => {
              //set host as the host's profile info form db
              if (hostData.data !== null) {
                setHost(hostData.data[0]);
              } else {
                setHostError(true);
              }
              //check if the current user is attending this event
              return supabase
                .from("attendees")
                .select("ticket_id")
                .eq("user_id", user.data.user?.id)
                .eq("event_id", event_id);
            })
            .then((attending: any) => {
              //if attending data comes through and the number of tickets is not 0, attending is true
              if (attending && attending.data.length > 0) {
                setIsAttending(true);
                setIsLoading(false);
              } else {
                setIsAttending(false);
                setIsLoading(false);
              }
            });
        } else {
          setIsLoading(false);
          setErr(error);
        }
      });
    });
  }, [event_id]);

  async function attendingClick() {
    setAttendError(false);
    if (isAttending) {
      setIsAttending(false);
      const { error } = await supabase
        .from("attendees")
        .delete()
        .eq("user_id", currentUser)
        .eq("event_id", event_id);
      if (error) {
        setIsAttending(true);
        setAttendError(true);
      }
    } else {
      setIsAttending(true);
      const { data, error } = await supabase
        .from("attendees")
        .insert([{ user_id: currentUser, event_id: event_id }])
        .select();
      if (error) {
        setIsAttending(false);
        setAttendError(true);
      }
    }
  }

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

  function goToMapPoint() {
    router.navigate(`./Map?lat=${eventData[0].location.latitude}&long=${eventData[0].location.longitude}`);
  }
     

  async function startChatWithHost() {
    const { data: existingChat, error: existingChatError } = await supabase.rpc(
      "get_chat_ids",
      {
        currentuser: currentUser,
        host: host.id,
      }
    );

    if (existingChat.length > 0) {
      router.navigate(`/(tabs)/TabTwo/${existingChat[0].chats_id}`);
      return;
    }
    const { data: chat } = await supabase
      .from("chats")
      .insert({})
      .select()
      .single();
    const { data, error } = await supabase.from("chat_users").insert([
      {
        chats_id: chat.id,
        user_id: currentUser,
      },
      {
        chats_id: chat.id,
        user_id: host.id,
      },
    ]);
    router.navigate(`/(tabs)/TabTwo/${chat.id}`);
  }

  return (
    <>
      <ScrollView style={styles.container}>
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
          {hostError ? (
            <Text>Something went wrong, host not found.</Text>
          ) : (
            <Text> {`${host.first_name} ${host.second_name}`}</Text>
          )}
          <Text style={styles.title}>Date: </Text>
          <Text> {readableDate}</Text>
          <Text style={styles.title}>Location:</Text>
          <Text> {eventData[0].address}</Text>
          {eventData[0].max_attendees ? (
            <Text style={styles.title}>
              Maximum attendees: {eventData[0].max_attendees}
            </Text>
          ) : (
            <Text style={styles.title}>Maximum attendees: N/A</Text>
          )}
          <Text style={styles.title}>Description:</Text>
          {eventData[0].description ? (
            <Text>{eventData[0].description}</Text>
          ) : (
            <Text>No description for this event</Text>
          )}
          {isAttending ? (
            <Button
              style={{ backgroundColor: "pink", width: 100 }}
              onPress={attendingClick}
              labelStyle={{ color: "black" }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              style={{ backgroundColor: "#CBC3E3", width: 100 }}
              onPress={attendingClick}
              labelStyle={{ color: "black" }}
            >
              Going!
            </Button>
          )}
          {attendError ? (
            <Text>
              Something went wrong! Cannot change attendance status at this
              time.
            </Text>
          ) : null}
          <Button onPress={goToMapPoint}>View on Map</Button>
          <Button onPress={startChatWithHost}>Chat to Host </Button>
        </View>
      </ScrollView>
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
