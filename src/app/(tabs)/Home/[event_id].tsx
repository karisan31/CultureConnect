import { fetchEventByID } from "@/src/Utils/api";
import Loading from "@/src/components/Loading";
import { Text, View } from "@/src/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as React from "react";
import { StyleSheet } from "react-native";
import { Button, Snackbar } from "react-native-paper";

export default function EventDetails() {
  const { event_id } = useLocalSearchParams();
  const [eventData, setEventData] = useState<any | null>(null);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    fetchEventByID(event_id).then(({ data, error }) => {
      if (data) {
        setIsLoading(false);
        setEventData(data);
      } else {
        setErr(error);
      }
    });
  }, [event_id]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!eventData ? (
            <Text>This event is either full or has been deleted!</Text>
          ) : (
            <>
              <Stack.Screen options={{ title: eventData[0].title }} />
              <Text>{eventData[0].title}</Text>
              <Text>{eventData[0].date}</Text>
              {/* <Text>{eventData[0].location}</Text> */}
              <Text>{eventData[0].attendees}</Text>
              <Text>{eventData[0].description}</Text>
              <Text>{eventData[0].attendees}</Text>
              <View style={styles.container}>
                <Button onPress={onToggleSnackBar}>
                  {visible ? "Going!" : "Attend"}
                </Button>
                <Snackbar
                  visible={visible}
                  onDismiss={onDismissSnackBar}
                  action={{
                    label: "Undo",
                    onPress: () => {
                      // Do something
                    },
                  }}
                >
                  You are attending!
                </Snackbar>
              </View>
            </>
          )}
        </>
      )}
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
