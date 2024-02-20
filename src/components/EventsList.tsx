import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  useColorScheme,
  FlatList,
} from "react-native";
import Colors from "../constants/Colors";
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

  const theme = useColorScheme();
  const textColor = [
    theme === "dark"
      ? { color: Colors.dark.text }
      : { color: Colors.light.text },
  ];

  return (
    <View>
      {isLoading ? (
        <Loading />
      ) : (
        <View>
          {eventsData.map((event) => {
            return (
              <EventCard
                key={event.event_id}
                date={event.date}
                title={event.title}
                description={event.description}
                attendees={event.max_attendees}
                location={event.location}
              />
            );
          })}
          {/* <FlatList
            data={eventsData}
            renderItem={({ item }) => <EventCard event={item} />}
          /> */}
        </View>
      )}
    </View>
  );
}
