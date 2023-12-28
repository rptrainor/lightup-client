import { supabase } from "~/db/connection";
  
async function fetchSupabaseUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

export default fetchSupabaseUser;
