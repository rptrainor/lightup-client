type UserMetadata = {
  deleted_at: string | undefined;
  updated_at: string | undefined;
  avatar_url: string | undefined;
  full_name: string | undefined;
  city: string | undefined;
  country: string | undefined;
  address_line1: string | undefined;
  address_line2: string | undefined;
  postal_code: string | undefined;
  state: string | undefined;
  stripe_customer_id: string | undefined;
};
export interface User {
  id: string;
  created_at: string | undefined;
  email: string | undefined;  // Make email optional
  phone: string | undefined;
  user_metadata: UserMetadata;
}