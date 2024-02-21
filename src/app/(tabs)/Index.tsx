import { StyleSheet, Image, Button } from "react-native";
import { Text, View } from "@/src/components/Themed";
import EventsList from "@/src/components/EventsList";

export default function Homepage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> CultureConnect </Text>
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
