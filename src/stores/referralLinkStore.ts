import { createSignal, createEffect } from 'solid-js';
import { supabase } from '~/db/connection';

// Define a type for the referral link state
type ReferralLink = {
  id: bigint;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  stripe_customer_id?: string;
  email?: string;
  user_id?: string;
  project_id?: string;
};

// Define a type for the composite key
type CompositeKey = {
  stripeCustomerId: string;
  projectId: string;
};

type Props = {
  stripeCustomerId: string;
  projectId: string;
}

// Using a Map to store referral links
const [referralLinkMap, setReferralLinkMap] = createSignal<Map<CompositeKey, ReferralLink>>(new Map());

const fetchReferralLinks = async ({ stripeCustomerId, projectId }: Props) => {
  try {
    let { data, error } = await supabase
      .from('referral_links')
      .select("*")
      .eq('stripe_customer_id', stripeCustomerId)
      .eq('project_id', projectId)
      .maybeSingle();

    console.log('fetchReferralLinks - data:', { data })
    if (error) throw error;

    // Check if data is not null and has elements before using it
    if (data && data.length > 0) {
      const referralLinks: ReferralLink[] = data as ReferralLink[];
      const key = { stripeCustomerId, projectId };
      setReferralLinkMap(prevMap => new Map(prevMap).set(key, referralLinks[0]));
    } else {
      console.error("No referral links found or data is null.");
      // Optionally, you can handle the null or empty case differently
      // For example, you could set an empty array or a default value in the map
    }
  } catch (error) {
    console.error("Error fetching referral links:", error);
  }
};

const getOrFetchReferralLinks = ({ stripeCustomerId, projectId }: Props) => {
  const key = { stripeCustomerId, projectId };
  const referralLinks = referralLinkMap().get(key);
  if (referralLinks) {
    return referralLinks;
  } else {
    fetchReferralLinks({ stripeCustomerId, projectId });
    return [];
  }
};


// Example use of fetchReferralLinks
// createEffect(() => {
//   const stripeCustomerId = 'some-customer-id'; // Replace with actual value
//   const projectId = 123; // Replace with actual value
//   fetchReferralLinks(stripeCustomerId, projectId);
// });

export {
  getOrFetchReferralLinks,
};