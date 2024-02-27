import { supabase } from "@/config/initSupabase";
import {
  fetchChatById,
  fetchChatMessagesByChatId,
  useCurrentUser,
} from "@/src/Utils/api";
import MessagesCard from "@/src/components/MessagesCard";
import RemoteImage from "@/src/components/RemoteImage";
import { ScrollView, View } from "@/src/components/Themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import { TextInput } from "react-native";
import { defaultProfileImage } from "../TabFour/UserProfile";
import Spinner from "react-native-loading-spinner-overlay";

interface Message {
  chat_id: string | string[];
  id: any;
  content: string;
  author_id: string;
  created_at: string;
}

interface CurrentUser {
  id: string;
}

interface ProfileData {
  avatar_url: string;
  first_name: string;
  second_name: string;
  email: string;
  bio: string;
}

export default function ChatRoom() {
  const { chat_id } = useLocalSearchParams();
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useCurrentUser();
  const [message, setMessage] = useState<string>("");
  const [otherUser, setOtherUser] = useState<string>("");
  const [otherUserProfileData, setOtherUserProfileData] =
    useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchMessagesAndChat = async () => {
      setIsLoading(true);
      try {
        const messages = await fetchChatMessagesByChatId(chat_id);
        setMessageData(messages || []);

        const chatUsers = await fetchChatById(chat_id);
        const uniqueUserIds = [
          ...new Set(messages?.map((message) => message.author_id)),
        ];
        const otherUserId = uniqueUserIds.find(
          (userId) => userId !== currentUser?.id
        );
        setOtherUser(otherUserId || "");
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching messages or chat:", error.message);
        setIsLoading(false);
      }
    };

    fetchMessagesAndChat();
  }, [chat_id, currentUser]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!otherUser) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", otherUser)
          .single();

        if (error) throw error;
        if (data) setOtherUserProfileData(data);
      } catch (error: any) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchProfileData();
  }, [otherUser]);

  const sendMessage = async () => {
    const msg: string = message.trim();
    if (msg.length === 0) return;

    const newMessage: Message = {
      id: Date.now(),
      chat_id: chat_id,
      author_id: (currentUser! as CurrentUser)?.id || "",
      content: msg,
      created_at: new Date().toISOString(),
    };

    setMessageData([...messageData, newMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([newMessage]);

      if (error) throw error;
      console.log("Message added successfully:");
    } catch (error: any) {
      console.error("Error adding message:", error.message);
      setMessageData((prevState) =>
        prevState.filter((item) => item.id !== newMessage.id)
      );
      setMessage(msg);
    }
  };

  console.log(otherUserProfileData, "profileData");
  return (
    <>
      <Spinner visible={isLoading} />
      <Stack.Screen
        options={{
          title: `Chatting with: ${otherUserProfileData?.first_name} ${otherUserProfileData?.second_name}`,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <RemoteImage
                path={otherUserProfileData?.avatar_url}
                fallback={defaultProfileImage}
                style={styles.profileImage}
                bucket="avatars"
              />
            </View>
          ),
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={130}
      >
        <ScrollView style={styles.messageContainer}>
          {messageData.map((chat) => (
            <MessagesCard key={chat.id} chat={chat} otherUser={otherUser} />
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Type a message"
            style={styles.messageInput}
          />
          <Button
            disabled={message === ""}
            title="Send"
            onPress={sendMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    marginRight: 10,
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
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  profileImage: {
    width: 25,
    height: 25,
    alignSelf: "center",
    borderRadius: 125,
    marginBottom: 1,
  },
});
