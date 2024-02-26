import { View } from "@/src/components/Themed";
import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Link, router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import RemoteImage from "./RemoteImage";
import { supabase } from "@/config/initSupabase";

export const defaultPartyImage =
  "https://img.freepik.com/free-vector/happy-friends-celebrating-event-together_74855-7482.jpg";

type EventProps = {
  event: {
    event_id: number;
    date: string;
    title: string;
    description: string | null;
    max_attendees: number | null;
    location: object;
    image: string | null;
  };
};

export default function EventCard({ event }: EventProps) {
  const [isAttending, setIsAttending] = React.useState<boolean>(false);
  const [attendError, setAttendError] = React.useState<boolean>(false);
  const [currentUser, setCurrentUser] = React.useState<string | undefined>(
    undefined
  );
  const eventDate = new Date(event.date);

  function goToEventPage() {
    router.navigate(`/(tabs)/Home/${event.event_id}`);
  }

  React.useEffect(() => {
    supabase.auth
      .getUser()
      .then((user) => {
        setCurrentUser(user.data.user?.id);
        return supabase
          .from("attendees")
          .select("ticket_id")
          .eq("user_id", user.data.user?.id)
          .eq("event_id", event.event_id);
      })
      .then((attending) => {
        if (attending.data?.length === 0 || attending.error) {
          setIsAttending(false);
        } else {
          setIsAttending(true);
        }
      });
  }, []);
  async function attendingClick() {
    setAttendError(false);
    if (isAttending) {
      setIsAttending(false);
      const { error } = await supabase
        .from("attendees")
        .delete()
        .eq("user_id", currentUser)
        .eq("event_id", event.event_id);
      if (error) {
        setIsAttending(true);
        setAttendError(true);
      }
    } else {
      setIsAttending(true);
      const { data, error } = await supabase
        .from("attendees")
        .insert([{ user_id: currentUser, event_id: event.event_id }])
        .select();
      if (error) {
        setIsAttending(false);
        setAttendError(true);
      }
    }
  }
  const readableDate = eventDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{event.title}</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          {/* <Text variant="bodyMedium">{event.description}</Text> */}
          <Text variant="bodyMedium">{readableDate}</Text>
          {/* <Text variant="bodyMedium">
            Max Attendees: {event.max_attendees || "N/A"}
          </Text> */}
        </Card.Content>
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
        <Card.Actions>
          <Button onPress={goToEventPage}>More Info</Button>
          {isAttending ? (
            <Button
              style={{ backgroundColor: "pink" }}
              onPress={attendingClick}
            >
              Cancel
            </Button>
          ) : (
            <Button onPress={attendingClick}>Going!</Button>
          )}
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
  },
  image: {
    width: "95%",
    alignSelf: "center",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "100%",
  },
});
