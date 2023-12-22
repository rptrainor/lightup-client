import { supabase } from '~/db/connection';

type Props = {
  userId: string;
  projectId: string;
}

async function likeProject(props: Props) {
  const { data, error } = await supabase
    .from('likes')
    .insert([
      { user_id: props.userId, project_id: props.projectId, is_liked: true },
    ])
    .select()
  if (error) {
    console.error('Error liking project:', error);
    return false;
  }

  return data;
}

export default likeProject
