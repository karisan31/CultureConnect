import { Text, View } from "@/src/components/Themed";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function EditProfile() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Edit Profile" }} />
      <Text>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "gray",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    padding: 20,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
    color: "#fff",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
    color: "#fff",
    backgroundColor: "#363636",
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
});
