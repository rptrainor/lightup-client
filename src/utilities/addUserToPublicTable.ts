import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';
import type { User } from '~/types/schema';

async function addUserToPublicTable(user: User) {
  try {
    const { data, error } = await supabase
      .from('user')
      .upsert([{ ...user }]); // Using upsert to insert or update based on the 'id'

    if (error) {
      addNotification({
        type: 'error',
        header: 'It looks like something went wrong',
        subHeader: 'Please try again later'
      })
      console.error(error);
    }

    return data;
  } catch (error) {
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    console.error(error);
  }
}

export default addUserToPublicTable;