import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  useColorScheme,
} from "react-native";
import EventsList from "@/src/components/EventsList";
import Colors from "@/src/constants/Colors";

export default function Homepage() {
  const theme = useColorScheme();

  const textColor = [
    theme === "dark"
      ? { color: Colors.dark.text }
      : { color: Colors.light.text },
  ];
  return (
    <View style={styles.container}>
      <Text style={textColor}> CultureConnect </Text>
      <Button title="List"></Button>
      <Button title="Map"></Button>
      <EventsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
