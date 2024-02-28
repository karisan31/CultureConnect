import { View, FlatList, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
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
    lat: 51.509865,
    lon: -0.118092,
  });
  const [radius, setRadius] = useState<number>(30000);
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

    if (
      location?.coords.latitude !== undefined &&
      location?.coords.longitude !== undefined
    ) {
      setCenter({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    }
  }, [location]);

  function handleSearch() {
    geoCode();
    setPostcode("");
  }

  function handleCurrentLocation() {
    setIsLoading(true);

    setCenter({
      lat: location?.coords.latitude || 51.509865,
      lon: location?.coords.longitude || -0.118092,
    });

    setIsLoading(false);
  }

  const handleSliderChange = (value: number) => {
    setRadius(value);
  };

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
      setTimeout(() => {
        setPostcodeError(false);
      }, 2000);
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

            <Button
              onPress={handleSearch}
              mode="contained"
              style={styles.searchButton}
            >
              <FontAwesome5 name="search-location" size={20} />
            </Button>
          </View>
          <View style={styles.locationSettings}>
            <Button
              children="use current location"
              onPress={handleCurrentLocation}
            />
            <Text style={styles.label}>
              Select Radius: {Math.round(radius / 1609.34)} miles
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={300000}
              step={1}
              value={radius}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor="#C3B1E1"
              maximumTrackTintColor="grey"
              thumbTintColor="#C3B1E1"
            />
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
  container: {
    margin: 20,
    width: 300,
  },
  label: {
    fontSize: 10,
    marginBottom: 10,
  },
  postcodeContainer: {
    flexDirection: "row",
    width: 300,
  },
  postcodeSearch: {
    flex: 1,
    width: 250,
  },
  searchButton: {
    alignSelf: "center",
    marginLeft: 15,
  },
  slider: {
    width: "100%",
  },
  locationSettings: {},
});
