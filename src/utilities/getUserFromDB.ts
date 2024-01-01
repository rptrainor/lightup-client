import { supabase } from "~/db/connection"

const getUserFromDB = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw error;
  }
  return user;
}

export default getUserFromDB