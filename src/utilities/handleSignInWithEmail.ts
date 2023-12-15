import { supabase } from "~/db/connection";

async function handleSignInWithEmailAuth(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.href,
    },
  })
  if (data) {
    console.log({ data });
  }
  if (error) {
    throw new Error(error.message);
  }
}

export default handleSignInWithEmailAuth;