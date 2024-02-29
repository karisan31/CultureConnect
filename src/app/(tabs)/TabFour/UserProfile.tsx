import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "@/src/components/Themed";
import { Image } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "@/config/initSupabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Loading from "@/src/components/Loading";
import RemoteImage from "@/src/components/RemoteImage";
import { Button } from "react-native-paper";
import { RefreshControl } from "react-native";

export const defaultProfileImage =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    navigation.setOptions({ headerShown: false });
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
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
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data");
    }
  };

  const goToEditProfile = () => {
    router.navigate(`/TabFour/EditProfile`);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfileData().then(() => {
      setRefreshing(false);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {refreshing && (
          <ActivityIndicator size="large" color="#fff" style={styles.refresh} />
        )}
        <Image
          source={require("../../../../assets/images/profileCover.png")}
          style={styles.coverImage}
        />
        <Text style={[styles.viewProfileText, { zIndex: 1 }]}>Profile</Text>
        <View style={styles.separator} />
        <RemoteImage
          path={profileData?.avatar_url}
          fallback={defaultProfileImage}
          style={styles.profileImage}
          bucket="avatars"
        />
        <Text style={styles.name}>
          {profileData?.first_name} {profileData?.second_name}
        </Text>
        <Text style={styles.bio}>{profileData?.bio}</Text>
        <Text style={styles.profileData}>{profileData?.email}</Text>
        <Button
          mode="contained"
          onPress={goToEditProfile}
          style={styles.editProfile}
        >
          Edit Profile
        </Button>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.overlayImages}>
        <Image
          source={require("../../../../assets/images/profileCover.png")}
          style={styles.coverImageTwo}
        />
        <Image
          source={require("../../../../assets/images/profileCover.png")}
          style={styles.coverImageThree}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: -250,
    marginBottom: -75,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  refresh: {
    zIndex: 1,
    position: "absolute",
    top: "25%",
    left: "50%",
    marginLeft: -20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: 700,
    height: 500,
    top: 10,
    borderRadius: 280,
  },
  viewProfileText: {
    bottom: 165,
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center",
  },
  editProfile: {
    marginTop: 10,
    marginBottom: 10,
    top: -140,
  },
  profileData: {
    padding: 10,
    fontSize: 18,
    top: -140,
    marginBottom: 30,
  },
  bio: {
    padding: 20,
    fontSize: 20,
    top: -140,
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
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
    top: -140,
    marginBottom: 20,
  },
  profileImage: {
    width: 225,
    height: 225,
    alignSelf: "center",
    borderRadius: 125,
    top: -140,
    marginBottom: 20,
  },
  signOut: {
    padding: 15,
    top: -135,
    backgroundColor: "#cc0000",
    borderRadius: 25,
  },
  signOutText: {
    color: "white",
    fontWeight: "500",
  },
  separator: {
    marginTop: 30,
    marginBottom: -25,
    height: 1,
    width: "80%",
    bottom: 190,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  coverImageTwo: {
    width: 200,
    height: 200,
    top: -260,
    right: 80,
    transform: [{ scaleX: -1 }],
    borderRadius: 100,
  },
  coverImageThree: {
    width: 700,
    height: 500,
    left: -50,
    transform: [{ scaleX: -1 }, { rotate: "90deg" }],
    borderRadius: 1000,
    top: -100,
  },
  overlayImages: {
    top: 650,
    position: "absolute",
  },
});
