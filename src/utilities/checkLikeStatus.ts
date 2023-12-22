import { supabase } from '~/db/connection';

type Props = {
  userId: string;
  projectId: string;
}

async function checkLikeStatus({ userId, projectId }: Props) {
  const { data, error } = await supabase
    .from('likes')
    .select('is_liked')
    .eq('user_id', userId)
    .eq('project_id', projectId);

  if (error) {
    console.error('Error checking like status:', error);
    return null;
  }

  return data?.[0]?.is_liked ?? false;
}

export default checkLikeStatus;
