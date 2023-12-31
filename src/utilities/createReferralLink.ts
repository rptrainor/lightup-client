import { supabase } from "~/db/connection"

type Props = {
  user_id: string;
  project_id: string;
  referring_id: string;
  email: string | undefined;
  stripe_customer_id: string | undefined;
};

const createReferralLink = async ({ user_id, project_id, referring_id, email, stripe_customer_id }: Props) => {
  if (!stripe_customer_id) {
    throw new Error('stripe_customer_id is required');
  }

  const { data, error } = await supabase
    .from('referral_links')
    .insert([
      {
        user_id: user_id,
        project_id: project_id,
        referring_id: referring_id,
        email: email,
        stripe_customer_id: stripe_customer_id,
      },
    ])
    .select()

  if (error) {
    throw error;
  }

  return data;
}

export default createReferralLink