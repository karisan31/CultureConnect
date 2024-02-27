import { StyleSheet, Image, Touchable, TouchableOpacity } from "react-native";
import { Button, Card } from "react-native-paper";

import { ScrollView, Text, View } from "@/src/components/Themed";
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
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require("../../../../assets/images/profileCover.png")}
          style={styles.coverImage}
        />
        <Text style={styles.title}>My Events</Text>
        <View style={styles.separator} />
        <Button
          mode="contained"
          onPress={goToPostEvent}
          style={styles.postButton}
        >
          Host an Event!
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: -250,
  },
  title: {
    bottom: 165,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: 700,
    height: 500,
    top: 10,
    borderRadius: 280,
  },
  postButton: {
    bottom: 125,
  },
  postText: {
    color: "white",
    fontWeight: "500",
  },
  separator: {
    marginTop: 30,
    marginBottom: -25,
    height: 1,
    width: "80%",
    bottom: 190,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
