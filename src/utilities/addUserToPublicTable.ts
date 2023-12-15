import { supabase } from '~/db/connection';
import type { User } from '~/types/schema';

async function addUserToPublicTable(user: User) {
  try {
    const { data, error } = await supabase
      .from('USER')
      .upsert([{ ...user }]); // Using upsert to insert or update based on the 'id'

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    throw new Error("Error in addUserToPublicTable");
  }
}

export default addUserToPublicTable;