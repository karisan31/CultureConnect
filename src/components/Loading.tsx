import { Text, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

export default function Loading() {
  const theme = useColorScheme();
  const textColor = [
    theme === "dark"
      ? { color: Colors.dark.text }
      : { color: Colors.light.text },
  ];
  return <Text style={textColor}>Loading ...</Text>;
}
