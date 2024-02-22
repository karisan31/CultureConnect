import { Text, View } from "@/src/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function EventDetails() {
  const { event_id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Details" }} />
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
