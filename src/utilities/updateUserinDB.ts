import { supabase } from "~/db/connection";
import type { User } from "~/types/schema";

const updateUserInDB = async (user: User) => {
  const { data, error } = await supabase.auth.updateUser({
    email: user.email,
    phone: user.phone,
    data: {
      city: user.user_metadata.city,
      state: user.user_metadata.state,
      country: user.user_metadata.country,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      updated_at: new Date().toISOString(),
      postal_code: user.user_metadata.postal_code,
      address_line1: user.user_metadata.address_line1,
      address_line2: user.user_metadata.address_line2,
      stripe_customer_id: user.user_metadata.stripe_customer_id,
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

export default updateUserInDB;