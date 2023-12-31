import { supabase } from "~/db/connection";

type Props = {
  stripe_customer_id: string | undefined;
  project_id: string;
}

const getReferralLinkFromDB = async ({stripe_customer_id, project_id}: Props) => {
  if (!stripe_customer_id) {
    return null;
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

  return existingLink;
};

export default getReferralLinkFromDB;