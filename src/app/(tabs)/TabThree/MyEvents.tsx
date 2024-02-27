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

export default function TabThreeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [userEvents, setUserEvents] = useState<EventType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
      }
    } catch (error) {
      console.error("Error fetching user events", Error);
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
    marginBottom: -25,
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
    top: -30,
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
    top: -20,
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
