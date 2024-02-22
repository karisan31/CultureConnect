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
  return { id, error };
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
    .select("*, users:chat_users!inner(user:profiles(first_name))")
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
