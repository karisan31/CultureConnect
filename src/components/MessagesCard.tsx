import { Text } from "./Themed";

export default function MessagesCard({ chat }) {
  return <Text>{chat.content}</Text>;
}
