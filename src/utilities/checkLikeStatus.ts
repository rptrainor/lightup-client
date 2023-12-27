import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';

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
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    console.log(error);
    return null;
  }

  return data?.[0]?.is_liked ?? false;
}

export default checkLikeStatus;
