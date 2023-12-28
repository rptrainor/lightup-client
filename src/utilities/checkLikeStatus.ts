import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';

type Props = {
  userId: string;
  projectId: string;
}

async function checkLikeStatus({ userId, projectId }: Props) {
  const { data, error } = await supabase
    .from('user_like')
    .select("*")
    .eq('user_id', userId)
    .eq('project_id', projectId);

  console.log('checkLikeStatus - data:', { data })
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
