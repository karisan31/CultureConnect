import { Card } from "react-native-paper";
import { ScrollView, Text, View } from "./Themed";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { fetchDataAndSetProfileData, useCurrentUser } from "../Utils/api";
import { useEffect, useState } from "react";
import { supabase } from "@/config/initSupabase";
import RemoteImage from "./RemoteImage";
import { defaultProfileImage } from "../app/(tabs)/TabFour/UserProfile";
import Spinner from "react-native-loading-spinner-overlay";
interface Chat {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
}
interface MessagesCardProps {
  chat: Chat;
  otherUser: string;
}
interface ProfileData {
  avatar_url: string;
  first_name: string;
  second_name: string;
  email: string;
  bio: string;
}
interface CurrentUser {
  id: string;
}

export default function MessagesCard({ chat }: MessagesCardProps) {
  const currentUser = useCurrentUser();
  const myMessage = chat.author_id === (currentUser! as CurrentUser)?.id;
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", chat.author_id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
        }
      } catch (error) {
        console.error("Error fetching profile data");
      }
    }

    fetchProfileData();
    setIsLoading(false);
  }, []);
  return (
    <>
      <Spinner visible={isLoading} />
      <View>
        <View>
          <RemoteImage
            path={profileData?.avatar_url}
            fallback={defaultProfileImage}
            style={[styles.profileImage, myMessage ? styles.currentUser : null]}
            bucket="avatars"
          />
          <Text style={[styles.user, myMessage ? styles.currentUser : null]}>
            {profileData?.first_name} {profileData?.second_name}
          </Text>
        </View>
        <View
          style={[
            styles.messageContainer,
            myMessage
              ? styles.userMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          <Text>{chat.content}</Text>
          <Text style={styles.time}>
            {new Date(chat.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  user: {
    fontSize: 12,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  profileImage: {
    width: 25,
    height: 25,
    alignSelf: "center",
    borderRadius: 125,
    marginBottom: 1,
  },
  messageInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  userMessageContainer: {
    backgroundColor: "green",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "grey",
  },
  currentUser: {
    alignSelf: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end",
  },
});
