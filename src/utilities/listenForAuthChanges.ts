import pkg from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { User } from '~/types/schema';
import { setUser } from "~/stores/auth_store";
import addUserToPublicTable from "~/utilities/addUserToPublicTable";

function listenForAuthChanges(supabase: SupabaseClient) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const loggedInUser = {
        id: session.user.id,
        email: session.user.email ?? null,
        is_active: true,
        name: session.user?.user_metadata?.name ?? null,
        avatar_url: session.user?.user_metadata?.avatar_url ?? null,
        picture: session.user?.user_metadata?.picture ?? null,
        full_name: session.user?.user_metadata?.full_name ?? null,
      } as User;

      addUserToPublicTable(loggedInUser);
      setUser(loggedInUser);
    }
  });
}

export default listenForAuthChanges;