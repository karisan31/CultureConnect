import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    const inAuthGroup = segments[0] === "(tabs)";

    if (session && !inAuthGroup) {
      router.replace("/Index");
    } else if (!session) {
      router.replace("/");
    }
  }, [session, initialized]);

  return <Slot />;
};

const RootLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
