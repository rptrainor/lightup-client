// User Table
export interface User {
  id: string;
  created_at: string | Date;
  updated_at: string | Date;
  email: string | null;
  is_active: boolean;
  name: string | null;
  avatar_url: string | null;
  picture: string | null;
  full_name: string | null;
}
