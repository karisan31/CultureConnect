import { View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { fetchEvents } from "../Utils/api";
import Loading from "./Loading";
import EventCard from "./EventCard";

export default function EventsList() {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [err, setErr] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
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
        <FlatList
          data={eventsData}
          renderItem={({ item }) => <EventCard event={item} />}
        />
      )}
    </View>
  );
}
