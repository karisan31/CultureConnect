import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

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
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

export default RootLayout;
