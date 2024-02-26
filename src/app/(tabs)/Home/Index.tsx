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
    <ScrollView showsVerticalScrollIndicator={false}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    minHeight: "100%",
    marginBottom: -340,
  },
  listContainer: {
    top: -350,
    marginTop: 20,
  },
  title: {
    color: "white",
    top: -440,
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  map: {
    marginVertical: 10,
    top: -410,
  },
  coverImage: {
    top: -240,
    width: 700,
    height: 500,
    borderRadius: 280,
  },
});
