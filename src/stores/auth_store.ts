import { createSignal, createEffect } from "solid-js";
// import { supabase } from "~/db/connection";
import type { User } from "~/types/schema";
// import listenForAuthChanges from "~/utilities/listenForAuthChanges";

const [user, setUser] = createSignal<User | null>(null);

// createEffect(() => {
//   listenForAuthChanges(supabase);
// });

export {
  user,
  setUser,
}