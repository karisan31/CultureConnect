import { StyleSheet, Image, Button } from "react-native";
import { Text, View } from "@/src/components/Themed";
import EventsList from "@/src/components/EventsList";

export default function Homepage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> CultureConnect </Text>
      <View style={styles.buttonsContainer}>
        <Button title="List"></Button>
        <Button title="Map"></Button>
      </View>
      <View style={styles.container}>
        <EventsList />
      </View>
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
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
});
