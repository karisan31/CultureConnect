import {
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Button, Card, Paragraph, Title } from "react-native-paper";

import { ScrollView, Text, View } from "@/src/components/Themed";
import { Link, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/config/initSupabase";
import RemoteImage from "@/src/components/RemoteImage";
import { Alert } from "react-native";

export default function TabThreeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [userEvents, setUserEvents] = useState<EventType[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [hostingEvents, setHostingEvents] = useState<EventType[]>([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    fetchUserEvents();
  }, []);

  const defaultPartyImage =
    "https://img.freepik.com/free-vector/happy-friends-celebrating-event-together_74855-7482.jpg";

  interface EventType {
    event_id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    address: string;
    image: string | null;
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("attendees")
          .select("*")
          .eq("user_id", user.data.user?.id);

        if (error) {
          throw error;
        }
        if (data) {
          const eventIds = data.map((item) => item.event_id);
          const { data: eventsData, error: eventsError } = await supabase
            .from("events")
            .select("*")
            .in("event_id", eventIds)
            .order("date", { ascending: true });
          if (eventsError) {
            throw eventsError;
          }
          setUserEvents(eventsData || []);
        }
        const { data: hostingData, error: hostingError } = await supabase
          .from("events")
          .select("*")
          .eq("host_id", user.data.user?.id)
          .order("date", { ascending: true });
        if (hostingError) {
          throw hostingError;
        }
        if (hostingData) {
          setHostingEvents(hostingData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching user events", error);
    }
  };

  function goToPostEvent() {
    router.navigate("/TabThree/PostEvent");
  }

  function formatEventDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  }

  const deleteEvent = async (event_id: number) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              console.log("Deleting event with ID:", event_id);
              const { error } = await supabase
                .from("events")
                .delete()
                .eq("event_id", event_id);

              if (error) {
                throw error;
              }
              console.log("Event deleted successfully.");
              fetchUserEvents();
            } catch (error) {
              console.error("Error deleting event", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  function moreInfo(event: EventType) {
    router.navigate(`/(tabs)/Home/${event.event_id}`);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/images/profileCover.png")}
          style={styles.coverImage}
        />
        <Text style={styles.title}>My Events</Text>
        <View style={styles.separator} />
        <Button
          mode="contained"
          onPress={goToPostEvent}
          style={styles.postButton}
        >
          Host an Event!
        </Button>
        <Text style={styles.eventsText}>Events you're attending: </Text>
        {userEvents.map((event, index) => (
          <Card key={index} style={styles.eventCard}>
            <Card.Content>
              <Title>{event.title}</Title>
              <Paragraph>{formatEventDate(event.date)}</Paragraph>
              <Paragraph>Address: {event.address}</Paragraph>
              <RemoteImage
                path={event.image}
                fallback={defaultPartyImage}
                style={[
                  styles.image,
                  {
                    height: 200,
                    marginTop: 10,
                    marginLeft: 5,
                    marginRight: 5,
                    borderRadius: 15,
                  },
                ]}
                bucket="event_images"
              />
              <Button mode="contained" onPress={() => moreInfo(event)}>
                More info
              </Button>
            </Card.Content>
          </Card>
        ))}
        {hostingEvents.length > 0 && (
          <Text style={styles.hostText}>Events you're hosting: </Text>
        )}
        {hostingEvents.map((event, index) => (
          <Card key={index} style={styles.eventCard}>
            <Card.Content>
              <Title>{event.title}</Title>
              <Paragraph>{formatEventDate(event.date)}</Paragraph>
              <Paragraph>Address: {event.address}</Paragraph>
              <RemoteImage
                path={event.image}
                fallback={defaultPartyImage}
                style={[
                  styles.image,
                  {
                    height: 200,
                    marginTop: 10,
                    marginLeft: 5,
                    marginRight: 5,
                    borderRadius: 15,
                  },
                ]}
                bucket="event_images"
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => moreInfo(event)}
                  style={styles.button}
                >
                  More info
                </Button>
                <Button
                  mode="contained"
                  onPress={() => deleteEvent(event.event_id)}
                  style={styles.deleteButton}
                >
                  Delete Event
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: -250,
    marginBottom: -20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: "transparent",
  },
  button: {
    width: "48%",
  },
  deleteButton: {
    width: "48%",
    backgroundColor: "#ff4747",
  },
  title: {
    bottom: 165,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  eventsText: {
    top: -50,
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
  },
  hostText: {
    marginTop: 15,
    top: -50,
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
  },
  coverImage: {
    width: 700,
    height: 500,
    top: 10,
    borderRadius: 280,
  },
  postButton: {
    bottom: 125,
  },
  postText: {
    color: "white",
    fontWeight: "500",
  },
  eventCard: {
    top: -40,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  image: {
    width: "95%",
    alignSelf: "center",
    aspectRatio: 1.5,
    borderRadius: 20,
    marginVertical: 10,
  },
  separator: {
    marginTop: 30,
    marginBottom: -25,
    height: 1,
    width: "80%",
    bottom: 190,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
