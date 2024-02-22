import { Stack } from "expo-router";

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="MyEvents" options={{ title: "MyEvents" }} />
    </Stack>
  );
}
