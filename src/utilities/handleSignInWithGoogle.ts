import { supabase } from "~/db/connection";

async function handleSignInWithGoogleAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) {
    throw new Error(error.message);
  }
}

export default handleSignInWithGoogleAuth;