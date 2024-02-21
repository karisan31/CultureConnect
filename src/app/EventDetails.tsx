import { Text, View } from "@/src/components/Themed";
import { StyleSheet } from "react-native";

export default function EventDetails() {
  return (
    <View style={styles.container}>
      <Text>event details</Text>
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
