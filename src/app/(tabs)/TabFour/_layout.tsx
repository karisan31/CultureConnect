import { Stack } from "expo-router";

export default function UserStack() {
  return (
    <Stack>
      <Stack.Screen name="UserProfile" options={{ title: "User Profile" }} />
    </Stack>
  );
}
