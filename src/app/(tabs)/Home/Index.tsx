import { StyleSheet, Image } from "react-native";
import { ScrollView, Text, View } from "@/src/components/Themed";
import EventsList from "@/src/components/EventsList";
import { Link, router } from "expo-router";
import { Button } from "react-native-paper";

export default function Homepage() {
  function viewMap() {
    router.navigate("/(tabs)/Home/Map");
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/profileCover.png")}
        style={styles.coverImage}
      />
      <Text style={[styles.title, { zIndex: 1 }]}> Home</Text>
      <Button mode="contained" onPress={viewMap} style={styles.map}>
        Map
      </Button>

      <View style={styles.listContainer}>
        <EventsList />
      </View>
      <View>
        <Text>End of Events</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    minHeight: "100%",
  },
  listContainer: {
    top: -300,
    marginBottom: 300,
  },
  title: {
    top: -440,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    top: -500,
  },
  coverImage: {
    width: 700,
    height: 500,
    top: -240,
    borderRadius: 280,
  },
  list: {
    margin: 5,
  },
  map: {
    margin: 5,
    top: -405,
  },
});
