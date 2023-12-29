import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';

type Props = {
  userId: string | undefined;
  projectId: string;
}

async function likeProject(props: Props): Promise<boolean | null> {
  if (!props.userId) {
    return null;
  }
  const { error } = await supabase
    .from('user_likes')
    .insert([
      { user_id: props.userId, project_id: props.projectId },
    ])

  if (error) {
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    return false;
  }

  return true;
}

export default likeProject
