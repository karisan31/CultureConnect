import React, { useEffect, useState } from "react";
import { fetchChatsByUserID } from "../../../Utils/api";
import { Text, View } from "@/src/components/Themed";
import { StyleSheet } from "react-native";
import { setupSubscription } from "../../../Utils/api";
import ChatCard from "@/src/components/ChatCard";
import { Link } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";

interface Chat {
  id: number;
  users: string[];
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

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <>
      <Spinner visible={isLoading} />
      <View style={styles.container}>
        {allChats.map((chat) => (
          <ChatCard key={chat.id} chat={chat} />
        ))}
      </View>
    </>
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
