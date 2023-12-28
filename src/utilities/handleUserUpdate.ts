import { supabase } from '~/db/connection';
import { handleSignInWithEmailAuth } from './handleSignInWithEmailAuth';

export interface StripeAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface StripeCustomerDetails {
  email: string;
  name: string;
  phone: string | null;
  address: StripeAddress;
  tax_exempt: string;
  tax_ids: any[];
}

export interface StripeResponse {
  customer_details: StripeCustomerDetails;
  // Add other relevant fields from the Stripe response object as needed
}


export async function handleUserUpdate(stripeResponse: StripeResponse) {
  const { customer_details } = stripeResponse;
  const { email, name, phone, address } = customer_details;

  // Check if user exists
  let { data: user, error } = await supabase
    .from('user')
    .select("*")
    .eq('email', email)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (user) {
    // Update user
    const { error } = await supabase
      .from('user')
      .update({
        name,
        phone,
        city: address.city,
        country: address.country,
        address_line1: address.line1,
        address_line2: address.line2,
        postal_code: address.postal_code,
        state: address.state,
      })
      .eq('email', email);

    if (error) {
      throw error;
    }
  } else {
    // Sign in and create user
    await handleSignInWithEmailAuth(email);
    const { data, error } = await supabase
      .from('user')
      .insert([{
        email,
        name,
        phone,
        city: address.city,
        country: address.country,
        address_line1: address.line1,
        address_line2: address.line2,
        postal_code: address.postal_code,
        state: address.state
      }]);

    if (error) {
      throw error;
    }
  }
}
