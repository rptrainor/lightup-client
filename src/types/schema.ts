type UserMetadata = {
  deleted_at: string | null;
  updated_at: string | null;
  avatar_url: string | null;
  full_name: string | null;
  city: string | null;
  country: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postal_code: string | null;
  state: string | null;
  stripe_customer_id: string | null;
};
export interface User {
  id: string | null;
  created_at: string | null;
  email: string | null;
  phone: string | null;
  user_metadata: UserMetadata;
}