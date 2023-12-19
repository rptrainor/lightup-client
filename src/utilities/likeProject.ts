import { supabase } from '~/db/connection';

type Props = {
  userId: string;
  projectId: string;
}

async function likeProject({ userId, projectId }: Props) {
  console.log('likeProject', { userId, projectId })
  const { data, error } = await supabase
    .from('likes')
    .insert([
      { user_id: userId, project_id: projectId, is_liked: true },
    ])
    .select()
  console.log('likeProject', { data, error })

  if (error) {
    console.error('Error liking project:', error);
    return false;
  }

  return data;
}

export default likeProject
