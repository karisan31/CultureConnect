import { Card } from "react-native-paper";
import { Text, View } from "./Themed";
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
