import { Stack } from "expo-router";
import { LocationProvider } from "@/src/components/LocationContext";

export default function HomeStack() {
  return (
    <LocationProvider>
    <Stack>
      <Stack.Screen name="Index" options={{ title: "Home" }} />
    </Stack>
    </LocationProvider>
  );
}
