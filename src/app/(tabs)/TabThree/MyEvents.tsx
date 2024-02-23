import { StyleSheet, Button } from "react-native";

import { Text, View } from "@/src/components/Themed";
import { Link, useRouter } from "expo-router";

export default function TabThreeScreen() {
  const router = useRouter();
  function goToPostEvent() {
    router.navigate("/TabThree/PostEvent");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyEvents</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <Link href={"/MyEvents/PostEvent"}> */}
      <Button title="Host an event!" onPress={goToPostEvent}></Button>
      {/* </Link> */}
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
