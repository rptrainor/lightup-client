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
    }

    return data;
  } catch (error) {
    console.error("Error in addUserToPublicTable:", error);
  }
}

const handleCheckUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    console.log("handleCheckUser - user:", { user })
    if (user && Object.keys(user).length > 0) {
      // Transform the user data
      const transformedUser: User = {
        id: user.id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.user_metadata.deleted_at,
        email: user.email,
        avatar_url: user.user_metadata.avatar_url,
        full_name: user.user_metadata.full_name,
        phone: user.phone,
        city: user.user_metadata.city,
        country: user.user_metadata.country,
        address_line1: user.user_metadata.address_line1,
        address_line2: user.user_metadata.address_line2,
        postal_code: user.user_metadata.postal_code,
        state: user.user_metadata.state,
        stripe_customer_id: user.user_metadata.stripe_customer_id,
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
  }
}

createEffect(async () => {
  handleCheckUser();
});

export {
  userState,
  setUserState,
};