import { StyleSheet, Button, Image } from "react-native";

import { Text, View } from "@/src/components/Themed";
import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TabThreeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  function goToPostEvent() {
    router.navigate("/TabThree/PostEvent");
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../assets/images/profileCover.png")}
        style={styles.coverImage}
      />
      <Text style={styles.title}>My Events</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Host an event!" onPress={goToPostEvent}></Button>
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
  coverImage: {
    width: 700,
    height: 500,
    top: -315,
    borderRadius: 300,
  },
});
