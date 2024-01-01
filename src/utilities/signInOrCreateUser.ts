import { supabase } from "~/db/connection";

const signInOrCreateUser = async (email: string | undefined) => {

  if (!email) {
    throw new Error('Email is required');
  }

  let { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  })

  if (error) {
    throw error;
  }
  return data;
};

export default signInOrCreateUser;