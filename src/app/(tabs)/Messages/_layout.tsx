import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="Messages" options={{ title: "Messages" }} />
    </Stack>
  );
}
