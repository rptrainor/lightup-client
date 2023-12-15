// User Table
export interface User {
  id: string;
  created_at: string | undefined;
  updated_at: string | undefined;
  email: string | undefined;
  is_active: boolean;
  name: string | undefined;
  avatar_url: string | undefined;
  picture: string | undefined;
  full_name: string | undefined;
}