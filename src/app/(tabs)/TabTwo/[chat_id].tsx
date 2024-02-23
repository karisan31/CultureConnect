import {
  fetchChatMessagesByChatId,
  getChatUserNames,
  useCurrentUser,
  useOtherUser,
  useProfileData,
} from "@/src/Utils/api";
import Loading from "@/src/components/Loading";
import MessagesCard from "@/src/components/MessagesCard";
import { Text, View } from "@/src/components/Themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
interface Message {
  id: number;
}

export default function chatRoom() {
  const { chat_id } = useLocalSearchParams();
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  //   const userIds = getChatUserNames(users);
  console.log(chat_id, "chatid");
  const currentUser = useCurrentUser();
  console.log(currentUser, "currentuser");
  //   const profileData = useProfileData(userIds);
  //   const otherUser = useOtherUser(currentUser, profileData);
  useEffect(() => {
    setIsLoading(true);
    const fetchMessages = async () => {
      try {
        const messages = await fetchChatMessagesByChatId(chat_id);
        setMessageData(messages || []);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();
  }, [chat_id]);
  console.log(messageData[0]?.id, "messageData");

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <Stack.Screen options={{ title: `Chatting with: ` }} />
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.separator} />
        {messageData.map((chat) => (
          <MessagesCard key={chat.id} chat={chat} />
        ))}
      </View>
      <Text>Hi</Text>
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
