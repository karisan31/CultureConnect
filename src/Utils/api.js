import { useEffect, useState } from "react";
import { supabase } from "../../config/initSupabase";

export const fetchEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");

  return { data, error };
};

export const fetchUserid = async () => {
  const {
    data: {
      user: { id },
    },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

export const fetchChatsByUserID = async () => {
  const {
    data: {
      user: { id },
    },
  } = await supabase.auth.getUser();
  const { data: chatIds, error } = await supabase
    .from("chats")
    .select("id, users:chat_users!inner(user_id)")
    .eq("users.user_id", id);

  if (error) {
    console.error("Error fetching chats IDs:", error.message);
    return [];
  }

  const chatIdArray = chatIds.map((chat) => chat.id);
  const { data: chats, error: fetchChatsError } = await supabase
    .from("chats")
    .select("*, users:chat_users!inner(user:profiles(id))")
    .in("id", chatIdArray);

  if (fetchChatsError) {
    console.error("Error fetching chats:", fetchChatsError.message);
    return [];
  }
  return chats;
};

export const setupSubscription = async (callback) => {
  let chatsWatcher;
  try {
    chatsWatcher = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        callback
      )
      .subscribe();
  } catch (error) {
    console.error("Error setting up subscription:", error.message);
  }

  return chatsWatcher;
};
export const fetchEventByID = async (event_id) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_id", event_id);
  return { data, error };
};

export const getChatUserNames = (users) => {
  if (users instanceof Array) {
    return users.map((user) => {
      return user.user instanceof Array ? user.user[0].id : user.user.id;
    });
  }
  return "";
};

const fetchUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
};

const fetchAllUserData = async (userIds) => {
  const userData = await Promise.all(userIds.map((id) => fetchUserData(id)));
  return userData;
};

export const fetchDataAndSetProfileData = async (userIds, setProfileData) => {
  const userData = await fetchAllUserData(userIds);
  setProfileData(userData);
};

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching current user:", error.message);
        return;
      }
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  return currentUser;
};

export const useProfileData = (userIds) => {
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    fetchDataAndSetProfileData(userIds, setProfileData);
  }, [userIds]);

  return profileData;
};

export const useOtherUser = (currentUser, profileData) => {
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (!currentUser || profileData.length === 0) return;

    const currentUserProfile = profileData.find(
      (profile) => profile.email === currentUser.email
    );
    if (!currentUserProfile) return;

    const otherUserProfile = profileData.find(
      (profile) => profile.email !== currentUser.email
    );
    if (!otherUserProfile) return;

    setOtherUser(
      `${otherUserProfile.first_name} ${otherUserProfile.second_name}`
    );
  }, [currentUser, profileData]);

  return otherUser;
};

export async function fetchChatMessagesByChatId(chatId) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching chat messages:", error.message);
    return null;
  }
}
