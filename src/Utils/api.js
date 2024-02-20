import { supabase } from "../lib/supabase";

export const fetchEvents = async () => {
  const { data, error } = await supabase.from("events").select("*");

  return { data, error };
};
