import { supabase } from '~/db/connection';

export async function handleSignInWithEmailAuth(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.href,
    },
  });
  if (error) {
    throw new Error(error.message);
  }
}