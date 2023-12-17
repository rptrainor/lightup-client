import { supabase } from '~/db/connection';

type Props = {
  userId: string;
  projectId: string;
}

async function unlikeProject({ userId, projectId }: Props) {
  const { data, error } = await supabase
    .from('likes')
    .update({ is_liked: false, unliked_at: new Date().toISOString() })
    .match({ user_id: userId, project_id: projectId })
    .select(); // Include this to return the updated row

  if (error) {
    console.error('Error unliking project:', error);
    return false;
  }

  return data;
}

export default unlikeProject;
