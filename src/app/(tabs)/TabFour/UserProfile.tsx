import { StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Text, View } from "@/src/components/Themed";
import { Image } from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/config/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Loading from "@/src/components/Loading";
import RemoteImage from "@/src/components/RemoteImage";

interface ProfileData {
  avatar_url: string;
  first_name: string;
  second_name: string;
  email: string;
  bio: string;
}

export default function ProfileDataScreen() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    navigation.setOptions({ headerShown: false });
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
            // console.log(data);
            setProfileData(data);
            setIsLoading(false);
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.viewProfileText, { zIndex: 1 }]}>My Profile</Text>

      <Image
        source={require("../../../../assets/images/profileCover.png")}
        style={styles.coverImage}
      />
      <RemoteImage
        path={profileData?.avatar_url}
        fallback={require("../../../../assets/images/defaultProfile.png")}
        style={styles.profileImage}
      />
      {/* <Image
        source={require("../../../../assets/images/defaultProfile.png")}
        style={styles.profileImage}
      /> */}
      <Text style={styles.name}>
        {profileData?.first_name} {profileData?.second_name}
      </Text>

      <Text style={styles.bio}>{profileData?.bio}</Text>

      <Text style={styles.profileData}>{profileData?.email}</Text>

      <Link href={"/TabFour/EditProfile"} style={styles.editProfile}>
        <Text>Edit Profile</Text>
      </Link>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    top: -200,
  },
  coverImage: {
    width: 700,
    height: 500,
    top: -100,
    borderRadius: 280,
  },
  viewProfileText: {
    top: 230,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  editProfile: {
    marginTop: 10,
    marginBottom: 10,
    top: -200,
    textDecorationLine: "underline",
  },
  profileData: {
    padding: 10,
    top: -220,
    fontSize: 18,
    marginBottom: 30,
  },
  bio: {
    padding: 20,
    top: -230,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    top: -220,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  profileImage: {
    width: 225,
    height: 225,
    alignSelf: "center",
    borderRadius: 125,
    marginBottom: 20,
    top: -220,
  },
  signOut: {
    padding: 15,
    backgroundColor: "#50C878",
    borderRadius: 25,
    top: -200,
  },
  signOutText: {
    color: "white",
    fontWeight: "500",
  },
});
