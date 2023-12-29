import { supabase } from '~/db/connection';

type Props = {
  stripeCustomerId: string;
  projectId: string;
  email: string;
  userId: string | undefined;
}

export async function getOrCreateReferralLink({ stripeCustomerId, projectId, email, userId }: Props) {
  // Check if a referral link already exists
  let { data: existingLink, error } = await supabase
    .from('referral_links')
    .select('*')
    .eq('stripe_customer_id', stripeCustomerId)
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
      .from('referral_links')
      .insert([
        { stripe_customer_id: stripeCustomerId, project_id: projectId, email, user_id: userId }
      ])
      .select();

    if (insertError) {
      throw insertError;
    }

    // Return the first element of the inserted rows array
    return newLinks?.[0];
  }
}
