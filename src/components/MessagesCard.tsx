import { Card } from "react-native-paper";
import { Text, View } from "./Themed";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { useCurrentUser } from "../Utils/api";
interface Chat {
  id: number;
  content: string;
  author_id: string;
}
interface MessagesCardProps {
  chat: Chat;
}

export default function MessagesCard({ chat }: MessagesCardProps) {
  const currentUser = useCurrentUser();
  const myMessage = chat.author_id === currentUser?.id;
  return (
    <View
      style={[
        styles.messageContainer,
        myMessage ? styles.userMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <Text>{chat.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
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
});
