import { supabase } from "@/config/initSupabase";
import {
  fetchChatMessagesByChatId,
  fetchUserid,
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
  content: string;
}

export default function chatRoom() {
  const { chat_id } = useLocalSearchParams();
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [UserIds, setUserIds] = useState([]);
  const currentUser = useCurrentUser();
  console.log(currentUser, "user");

  //   const userIds =
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
    async function fetchChatById(chatId: any) {
      try {
        const { data, error } = await supabase
          .from("chat_users")
          .select("*")
          .eq("chats_id", chatId);

        if (error) {
          throw error;
        }
        return data;
      } catch (error: any) {
        console.error("Error fetching chat:", error.message);
        return null;
      }
    }

    fetchMessages();
    fetchChatById(chat_id);
  }, [chat_id]);

  if (isLoading) {
    return <Loading />;
  }
  console.log(messageData);
  return (
    <>
      <Stack.Screen options={{ title: `Chatting with: ` }} />
      {messageData.map((chat) => (
        <MessagesCard key={chat.id} chat={chat} />
      ))}
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
