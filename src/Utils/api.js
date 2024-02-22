import { supabase } from "../../config/initSupabase";

export const fetchEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");

  return { data, error };
};

export const fetchEventByID = async (event_id) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_id", event_id);
  return { data, error };
};
