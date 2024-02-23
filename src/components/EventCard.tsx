import { View } from "@/src/components/Themed";
import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

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

  const readableDate = eventDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return (
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
      <Card.Cover
        style={styles.image}
        source={{
          uri: event.image || defaultPartyImage,
        }}
      />
      <Card.Actions>
        <Button>
          <Link href={`/(tabs)/Home/${event.event_id}`}>More Info</Link>
        </Button>

        <Button>Going!</Button>
      </Card.Actions>
    </Card>
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
