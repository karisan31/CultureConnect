import { View } from "@/src/components/Themed";
import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export const defaultPartyImage =
  "https://img.freepik.com/free-vector/happy-friends-celebrating-event-together_74855-7482.jpg";

type EventProps = {
  event: {
    id: number;
    date: string;
    title: string;
    description: string | null;
    attendees: number | null;
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
    <Card>
      <Card.Content>
        <Text variant="titleLarge">{event.title}</Text>
        <Text variant="bodyMedium">{event.description}</Text>
        <Text variant="bodyMedium">{readableDate}</Text>
        <Text variant="bodyMedium">Max Attendees: {event.attendees}</Text>
      </Card.Content>
      <Card.Cover
        source={{
          uri: event.image || defaultPartyImage,
        }}
      />
      <Card.Actions>
        <Button>
          <Link href={`/(tabs)/Home/${event.id}`}>More Info</Link>
        </Button>

        <Button>Going!</Button>
      </Card.Actions>
    </Card>

    // <View style={styles.container}>
    //   <Text variant="titleLarge">{event.title}</Text>
    //   <Text variant="bodyMedium">{event.description}</Text>
    //   <Text variant="bodyMedium">{event.date}</Text>
    //   <Text variant="bodyMedium">Max Attendees:{event.attendees}</Text>
    //   <Image
    //     source={{
    //       uri: event.image || defaultPartyImage,
    //     }}
    //     style={styles.image}
    //     resizeMode="contain"
    //   />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
