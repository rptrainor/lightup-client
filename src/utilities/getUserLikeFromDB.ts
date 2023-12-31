import { supabase } from "~/db/connection";

type Props = {
  user_id: string | undefined;
  project_id: string;
}

const getUserLikeFromDB = async ({ user_id, project_id }: Props) => {
  if (!user_id) {
    return null;
  }

  // Check if a referral link already exists
  let { data: existingUserLike, error } = await supabase
    .from('user_likes')
    .select('*')
    .eq('user_id', user_id)
    .eq('project_id', project_id)
    .maybeSingle();

  if (error) { // Check for errors other than 'no rows found'
    throw error;
  }

  return existingUserLike;
};

export default getUserLikeFromDB;