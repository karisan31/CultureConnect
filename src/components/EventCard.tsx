import { Text, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

type EventProps = {
  date: string;
  title: string;
  description: string;
  attendees: number;
  location: object;
};

export default function EventCard(props: EventProps) {
  console.log(props);
  const theme = useColorScheme();
  const textColor = [
    theme === "dark"
      ? { color: Colors.dark.text }
      : { color: Colors.light.text },
  ];
  return <Text style={textColor}>This is an Event Card!</Text>;
}
