import { supabase } from "~/db/connection";

type Props = {
  user_id: string;
  project_id: string;
};

const createUserLike = async ({ user_id, project_id }: Props) => {
  const { data, error } = await supabase
    .from('user_likes')
    .insert([
      { user_id: user_id, project_id: project_id },
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
};

export default createUserLike;