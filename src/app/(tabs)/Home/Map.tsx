import React, { useState, useEffect } from "react";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { Text } from "@/src/components/Themed";
import { fetchEvents } from "@/src/Utils/api";
import Loading from "@/src/components/Loading";
import { defaultPartyImage } from "@/src/components/EventCard";
import RemoteImage from "@/src/components/RemoteImage";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useLocation } from "@/src/components/LocationContext";
import { useLocalSearchParams } from "expo-router";

interface Event {
  date: string;
  description: string | null;
  event_id: number;
  host_id: string;
  image: string | null;
  location: {
    latitude: number;
    longitude: number;
  };
  max_attendees: number | null;
  title: string;
}

export default function Map() {
  const fromEvent = useLocalSearchParams();
  const [initialRegion, setInitialRegion] = useState({
    latitude: 54.7024,
    longitude: -3.2765,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    
    
    setIsLoading(true);
    if (fromEvent && !isNaN(Number(fromEvent.lat))) {
      setInitialRegion({
        latitude: Number(fromEvent.lat),
        longitude: Number(fromEvent.long),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } else {
      setInitialRegion({
        latitude: 54.7024,
        longitude: -3.2765,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    }
    fetchEvents().then((data) => {
      if (data && data.data) {
        setEvents(data.data);
        setIsLoading(false);
      } else {
        console.error("Error fetching events: Invalid data format");
      }
    });
  }, []);

  function goToEvent(event_id: number) {
    router.navigate(`./${event_id}`);
  }

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {events.map((event) => {
            const eventDate = new Date(event.date);

            const readableDate = eventDate.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            return (
              <Marker
                key={event.event_id}
                coordinate={{
                  latitude: event.location.latitude
                    ? event.location.latitude
                    : 0,
                  longitude: event.location.longitude
                    ? event.location.longitude
                    : 0,
                }}
              >
                <Callout
                  style={styles.container}
                  onPress={() => {
                    goToEvent(event.event_id);
                  }}
                >
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{event.title}</Text>
                    <RemoteImage
                      path={event.image}
                      fallback={defaultPartyImage}
                      style={styles.image}
                      bucket="event_images"
                    />
                    <Text style={styles.date}>{readableDate}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    marginTop: -14,
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    width: 200,
  },
  calloutText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  date: {
    fontSize: 10,
    color: "black",
    marginLeft: 10,
  },
});
