import { Card } from "react-native-paper";
import { Text, View } from "./Themed";
import { StyleSheet } from "react-native";
interface Chat {
  id: number;
  content: string;
}
interface MessagesCardProps {
  chat: Chat;
}

export default function MessagesCard({ chat }: MessagesCardProps) {
  return (
    <Card>
      <Card.Content>
        <Text>{chat.content}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
