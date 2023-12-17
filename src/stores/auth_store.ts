import { createSignal, createEffect } from 'solid-js';
import { supabase } from '~/db/connection';
import type { User } from '~/types/schema';

// Define a type for the user state
type UserState =
  | { status: 'initial', user: null }
  | { status: 'loggedOut', user: null }
  | { status: 'loggedIn'; user: User };

const [userState, setUserState] = createSignal<UserState>({ status: 'initial', user: null });

export async function addUserToPublicTable(user: User) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([{ ...user }]); // Using upsert to insert or update based on the 'id'

    if (error) {
      console.error("Error in addUserToPublicTable:", error);
      // throw new Error("Error adding/updating user");
    }

    return data;
  } catch (error) {
    console.error("Error in addUserToPublicTable:", error);
    // throw new Error("Error in addUserToPublicTable");
  }
}

const handleCheckUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    // if (error) {
    //   console.error("Error in handleCheckUser:", error);
    //   throw new Error("Error in handleCheckUser");
    // }

    if (user && Object.keys(user).length > 0) {
      // Transform the user data
      const transformedUser: User = {
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        email: user.email,
        is_active: true,
        name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
        full_name: user.user_metadata.full_name,
        picture: user.user_metadata.avatar_url,
      };
      setUserState({ status: 'loggedIn', user: transformedUser });

      // Sync user with public.users table
      await addUserToPublicTable(transformedUser);
    } else if (user === null) {
      setUserState({ status: 'loggedOut', user: null });
    } else {
      setUserState({ status: 'initial', user: null });
    }
  } catch (error) {
    console.error("Error in handleCheckUser:", error);
    throw new Error("Error in handleCheckUser");
  }
}

createEffect(async () => {
  handleCheckUser();
});

createEffect(() => {
  console.log("auth_store.ts: userState changed:", userState());
});

export {
  userState,
  setUserState,
};
