import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';

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
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    return false;
  }

  return data;
}

export default likeProject
