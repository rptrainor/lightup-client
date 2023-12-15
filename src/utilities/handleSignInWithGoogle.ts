import { supabase } from "~/db/connection";

async function handleSignInWithGoogleAuth() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (data) {
    console.log({ data });
  }
  if (error) {
    throw new Error(error.message);
  }
}

export default handleSignInWithGoogleAuth;