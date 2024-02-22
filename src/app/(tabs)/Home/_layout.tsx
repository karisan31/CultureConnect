import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="Index" options={{ title: "Home" }} />
    </Stack>
  );
}
