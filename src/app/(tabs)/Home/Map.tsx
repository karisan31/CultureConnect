import React, { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { Text } from "@/src/components/Themed";
import { fetchEvents } from "@/src/Utils/api";

interface Event {
  date: string;
  description: string | null;
  event_id: number;
  host_id: string;
  image: string | null;
  location: {
    latitude: string;
    longitude: string;
  };
  max_attendees: number | null;
  title: string;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | {}>({
    latitude: 51.5074,
    longitude: -0.0877,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  useEffect(() => {
    fetchEvents().then((data) => {
      if (data && data.data) {
        setEvents(data.data);
      } else {
        console.error("Error fetching events: Invalid data format");
      }
    });
  

    getLocationPermission().then(() => {
        Location.getCurrentPositionAsync({})
          .then((acquiredLocation) => {
            setUserLocation({
              latitude: acquiredLocation.coords.latitude,
              longitude: acquiredLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          })
          .catch((error) => {
            console.error("Error getting location:", error);
          });
      });
    }, []);

  const INITIAL_REGION = {
    latitude: 51.509865,
    longitude: -0.118092,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <Text>{errorMsg}</Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {events.map((event) => (
          <Marker
            key={event.event_id}
            coordinate={{
              latitude: parseFloat(event.location.latitude),
              longitude: parseFloat(event.location.longitude),
              

            }}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "95%",
  },
});
