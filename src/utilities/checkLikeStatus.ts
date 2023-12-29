import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';

type Props = {
  userId: string | undefined;
  projectId: string;
}

async function checkLikeStatus({ userId, projectId }: Props): Promise<boolean | null> {
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from('user_likes')
    .select("*")
    .eq('user_id', userId)
    .eq('project_id', projectId);

  if (error) {
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    console.error(error);
    return null;
  }

  return data?.[0]?.liked_at ?? false;
}

export default checkLikeStatus;
