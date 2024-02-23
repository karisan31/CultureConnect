import { View } from "@/src/components/Themed";
import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Link, router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import RemoteImage from "./RemoteImage";

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
  const eventDate = new Date(event.date);

  function goToEventPage() {
    router.navigate(`/(tabs)/Home/${event.event_id}`);
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
          <Text variant="bodyMedium">{event.description}</Text>
          <Text variant="bodyMedium">{readableDate}</Text>
          <Text variant="bodyMedium">
            Max Attendees: {event.max_attendees || "N/A"}
          </Text>
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

          <Button>Going!</Button>
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
