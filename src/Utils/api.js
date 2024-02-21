import { supabase } from "../../config/initSupabase";

export const fetchEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");

  return { data, error };
};
