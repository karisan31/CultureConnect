import { View } from "@/src/components/Themed";
import * as React from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";

export const defaultPartyImage =
  "https://img.freepik.com/free-vector/happy-friends-celebrating-event-together_74855-7482.jpg";

type EventProps = {
  date: string;
  title: string;
  description: string | null;
  attendees: number | null;
  location: object;
  image: string | null;
};

export default function EventCard(props: EventProps) {
  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge">{props.title}</Text>
        <Text variant="bodyMedium">{props.description}</Text>
        <Text variant="bodyMedium">{props.date}</Text>
        <Text variant="bodyMedium">Max Attendees: {props.attendees}</Text>
      </Card.Content>
      <Card.Cover
        source={{
          uri: props.image || defaultPartyImage,
        }}
      />
      <Card.Actions>
        <Button>More Info</Button>
        <Button>Going!</Button>
      </Card.Actions>
    </Card>
  );
}
