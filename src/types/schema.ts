// User Table
export interface User {
  id: string;
  created_at: string | undefined;
  updated_at: string | undefined;
  deleted_at: string | undefined;
  email: string | undefined;
  avatar_url: string | undefined;
  full_name: string | undefined;
  phone: string | undefined;
  city: string | undefined;
  country: string | undefined;
  address_line1: string | undefined;
  address_line2: string | undefined;
  postal_code: string | undefined;
  state: string | undefined;
  stripe_customer_id: string | undefined;
}