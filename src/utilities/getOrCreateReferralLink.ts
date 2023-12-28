import { supabase } from '~/db/connection';

type Props = {
  userId: string;
  projectId: string;
}

export async function getOrCreateReferralLink({ userId, projectId }: Props) {
  // Check if a referral link already exists
  let { data: existingLink, error } = await supabase
    .from('referral_link')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // Check for errors other than 'no rows found'
    throw error;
  }

  if (existingLink) {
    // Return the existing referral link
    return existingLink;
  } else {
    // Insert a new referral link and then select it
    const { data: newLinks, error: insertError } = await supabase
      .from('referral_link')
      .insert([
        { user_id: userId, project_id: projectId }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // Return the first element of the inserted rows array
    return newLinks?.[0];
  }
}
