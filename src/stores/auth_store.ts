import { createSignal, createEffect } from 'solid-js';
import { supabase } from '~/db/connection';
import type { User } from '~/types/schema';

// Define a type for the user state
type UserState =
  | { status: 'initial', user: null }
  | { status: 'loggedOut', user: null }
  | { status: 'loggedIn'; user: User };

const [userState, setUserState] = createSignal<UserState>({ status: 'initial', user: null });


const handleCheckUser = async () => {
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();

  if (supabaseUser && Object.keys(supabaseUser).length > 0) {
    // Assuming supabaseUser has the necessary properties of your User type
    const transformedUser: User = {
      id: supabaseUser.id,
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
      email: supabaseUser.email,
      is_active: true,
      name: supabaseUser.user_metadata.full_name,
      avatar_url: supabaseUser.user_metadata.avatar_url,
      full_name: supabaseUser.user_metadata.full_name,
      picture: supabaseUser.user_metadata.avatar_url,
    };
    setUserState({ status: 'loggedIn', user: transformedUser });
  } else if (supabaseUser === null) {
    setUserState({ status: 'loggedOut', user: null });
  } else {
    setUserState({ status: 'initial', user: null });
  }
}

createEffect(async () => {
  handleCheckUser();
});

export {
  userState,
  setUserState,
};
