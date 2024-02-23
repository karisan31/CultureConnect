import { Stack } from "expo-router";

export default function myEventsStack() {
  return (
    <Stack>
      <Stack.Screen name="MyEvents" options={{ title: "MyEvents" }} />
    </Stack>
  );
}
