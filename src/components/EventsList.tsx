import { View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { fetchEvents } from "../Utils/api";
import Loading from "./Loading";
import EventCard from "./EventCard";
import { useNavigation } from "expo-router";

export default function EventsList() {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

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

  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        eventsData.map((event, index) => (
          <EventCard key={index} event={event} />
        ))
      )}
    </View>
  );
}
