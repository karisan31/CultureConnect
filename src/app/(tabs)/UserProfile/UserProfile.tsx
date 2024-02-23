import { StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Text, View } from "@/src/components/Themed";
import { Image } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/config/initSupabase";

interface ProfileData {
  avatar_url: string;
  first_name: string;
  second_name: string;
  email: string;
  bio: string;
}

export default function ProfileDataScreen() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const user = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.data.user?.id)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setProfileData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data");
      }
    }

    fetchProfileData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <Image
        source={
          profileData?.avatar_url
            ? { uri: profileData.avatar_url }
            : require("../../../../assets/images/defaultProfile.png")
        }
        style={styles.profileImage}
      />

      <Text style={styles.profileData}>
        First Name: {profileData?.first_name}
      </Text>
      <Text style={styles.profileData}>
        Surname: {profileData?.second_name}
      </Text>
      <Text style={styles.profileData}>Email: {profileData?.email}</Text>
      <Text style={styles.profileData}>Bio: {profileData?.bio}</Text>

      <Link href={"/UserProfile/EditProfile"} style={styles.editProfile}>
        <Text>Edit Profile</Text>
      </Link>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editProfile: {
    marginTop: 10,
    marginBottom: 10,
  },
  profileData: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  profileImage: {
    width: 140,
    height: 140,
    alignSelf: "center",
    borderRadius: 85,
    marginBottom: 20,
  },
  signOut: {
    padding: 15,
    backgroundColor: "#6750a4",
    borderRadius: 25,
  },
  signOutText: {
    color: "white",
    fontWeight: "500",
  },
});
