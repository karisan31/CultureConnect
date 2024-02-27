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
        <Text style={styles.title}> My Events</Text>

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
    bottom: 190,
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
    bottom: 150,
  },
  postText: {
    color: "white",
    fontWeight: "500",
  },
});
