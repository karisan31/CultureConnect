import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { fetchEvents } from "../Utils/api";
import Loading from "./Loading";
import EventCard from "./EventCard";
import { useNavigation } from "expo-router";
import { useLocation } from "./LocationContext";
import { insideCircle } from "geolocation-utils";
import { Button, TextInput } from "react-native-paper";
import { Text } from "./Themed";
import { FontAwesome5 } from "@expo/vector-icons";

export default function EventsList() {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { location } = useLocation();
  const [center, setCenter] = useState({
    lat: location?.coords.latitude || 51.509865,
    lon: location?.coords.longitude || -0.118092,
  });
  const [radius, setRadius] = useState<number>(10000);
  const [postcode, setPostcode] = useState<string>("");
  const [postcodeError, setPostcodeError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    navigation.setOptions({ headerShown: false });

    setErr(null);
    fetchEvents().then(({ data, error }) => {
      if (data) {
        setIsLoading(false);
        setEventsData(data);
      } else {
        setErr(error);
      }
    });
  }, []);

  function HandleSearch() {
    geoCode();
  }

  const geoCode = async () => {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}`
    );
    const locationData = await response.json();
    if (!locationData.error) {
      setCenter({
        lat: locationData.result.latitude,
        lon: locationData.result.longitude,
      });
    } else {
      setPostcodeError(true);
    }
  };

  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        <>
        <Text>Enter postcode to find nearest events</Text>
          <View style={styles.postcodeContainer}>
            <TextInput
              placeholder="Postcode"
              value={postcode}
              onChangeText={setPostcode}
              mode="outlined"
              style={styles.postcodeSearch}
            />
            <Button onPress={HandleSearch} mode="contained" style={styles.searchButton}>
              <FontAwesome5 name="search-location" size={20} />
            </Button>
          </View>
          {postcodeError ? (
            <Text style={[styles.label, { color: "red" }]}>
              Please enter a valid postcode
            </Text>
          ) : null}
          <View style={styles.container}>
            {eventsData.map((event, index) =>
              (() => {
                if (
                  insideCircle(
                    {
                      lat: event.location.latitude,
                      lon: event.location.longitude,
                    },
                    center,
                    radius
                  )
                ) {
                  return <EventCard key={index} event={event} />;
                }
              })()
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "gray",
  },
  container: {
    width: "125%",
    alignSelf: "center",
  },
  postcodeContainer: {
    flexDirection: "row"
  },
  postcodeSearch:{
    flex: 1,
  },
  searchButton: {
    alignSelf: "center",
    marginLeft: 15
  }
});
