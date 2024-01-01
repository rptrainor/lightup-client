import { supabase } from "~/db/connection";

type Props = {
  stripe_customer_id: string | undefined;
  project_id: string;
}

const getReferralLinkFromDB = async ({ stripe_customer_id, project_id }: Props) => {
  if (!stripe_customer_id) {
    throw new Error('stripe_customer_id is required');
  }

  // Check if a referral link already exists
  let { data: existingLink, error } = await supabase
    .from('referral_links')
    .select('*')
    .eq('stripe_customer_id', stripe_customer_id)
    .eq('project_id', project_id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // Check for errors other than 'no rows found'
    throw error;
  }

  console.log('getReferralLinkFromDB', { existingLink });
  return existingLink;
};

export default getReferralLinkFromDB;