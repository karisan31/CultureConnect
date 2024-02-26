import { supabase } from "@/config/initSupabase";
import { fetchChatMessagesByChatId, useCurrentUser } from "@/src/Utils/api";
import Loading from "@/src/components/Loading";
import MessagesCard from "@/src/components/MessagesCard";
import { View } from "@/src/components/Themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import { TextInput } from "react-native";

interface Message {
  id: number;
  content: string;
}

export default function chatRoom() {
  const { chat_id } = useLocalSearchParams();
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();
  const [message, setMessage] = useState<string>("");
  const [otherUser, setOtherUser] = useState("");

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

  const sendMessage = async () => {
    const msg: string = message.trim();
    if (msg.length === 0) return;

    const newMessage: Message = {
      chat_id: chat_id,
      author_id: currentUser?.id,
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessageData([...messageData, newMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([newMessage]);

      if (error) {
        console.error("Error adding message:", error.message);

        setMessageData((prevState) =>
          prevState.filter((item) => item.id !== newMessage.id)
        );
        setMessage(msg);
      } else {
        console.log("Message added successfully:", data);
      }
    } catch (error: any) {
      console.error("Error sending message:", error.message);

      setMessageData((prevState) =>
        prevState.filter((item) => item.id !== newMessage.id)
      );
      setMessage(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen options={{ title: `Chatting with: ${otherUser} ` }} />
      {messageData.map((chat) => (
        <MessagesCard key={chat.id} chat={chat} />
      ))}
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          style={styles.messageInput}
        />
        <Button disabled={message === ""} title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "#fff",
  },
});
