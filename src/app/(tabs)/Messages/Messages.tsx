import React, { useEffect, useState } from "react";
import { fetchChatsByUserID } from "../../../Utils/api";
import { Text, View } from "@/src/components/Themed";
import { StyleSheet } from "react-native";
import { setupSubscription } from "../../../Utils/api";

interface Chat {
  id: number;
}

export default function Messages(): JSX.Element {
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  let chatsWatcher: any;

  const fetchData = async (): Promise<void> => {
    try {
      const fetchedChats: Chat[] = await fetchChatsByUserID();
      setAllChats(fetchedChats);
      setupSubscription(async () => {
        try {
          const updatedChats = await fetchChatsByUserID();
          setAllChats(updatedChats);
        } catch (error: any) {
          setError(error.message);
        }
      });
    } catch (error) {
      setError("Failed to fetch chats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cleanup = (): void => {
    if (chatsWatcher) {
      chatsWatcher.unsubscribe();
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.separator} />
      {allChats.map((chat) => (
        <Text key={chat.id}>{chat.id}</Text>
      ))}
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
