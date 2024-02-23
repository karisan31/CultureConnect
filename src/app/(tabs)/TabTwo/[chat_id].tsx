import {
  fetchChatMessagesByChatId,
  getChatUserNames,
  useCurrentUser,
  useOtherUser,
  useProfileData,
} from "@/src/Utils/api";
import { Text } from "@/src/components/Themed";
import { Stack, useLocalSearchParams } from "expo-router";

export default function chatRoom() {
  const { chat_id } = useLocalSearchParams();
  //   const userIds = getChatUserNames(users);
  const currentUser = useCurrentUser();
  console.log(currentUser, "currentuser");
  //   const profileData = useProfileData(userIds);
  //   const otherUser = useOtherUser(currentUser, profileData);
  const messages = fetchChatMessagesByChatId(chat_id);
  console.log(messages, "messages");

  return (
    <>
      <Stack.Screen options={{ title: `Chatting with: ` }} />
      <Text>Hi</Text>
    </>
  );
}
