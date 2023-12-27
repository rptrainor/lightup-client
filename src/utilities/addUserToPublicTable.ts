import { supabase } from '~/db/connection';
import { addNotification } from '~/stores/notificationStore';
import type { User } from '~/types/schema';

async function addUserToPublicTable(user: User) {
  try {
    const { data, error } = await supabase
      .from('USER')
      .upsert([{ ...user }]); // Using upsert to insert or update based on the 'id'

    if (error) {
      addNotification({
        type: 'error',
        header: 'It looks like something went wrong',
        subHeader: 'Please try again later'
      })
      console.log(error);
    }

    return data;
  } catch (error) {
    addNotification({
      type: 'error',
      header: 'It looks like something went wrong',
      subHeader: 'Please try again later'
    })
    console.log(error);
  }
}

export default addUserToPublicTable;