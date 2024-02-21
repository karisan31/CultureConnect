import { Text, View } from "@/src/components/Themed";

type EventProps = {
  date: string;
  title: string;
  description: string;
  attendees: number;
  location: object;
};

export default function EventCard(props: EventProps) {
  console.log(props);
  return <Text>This is an Event Card!</Text>;
}
