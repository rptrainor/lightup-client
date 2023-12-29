import { supabase } from '~/db/connection';

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
  customer: string;
  // Add other relevant fields from the Stripe response object as needed
}


export async function handleUserUpdate(stripeResponse: StripeResponse) {
  const { customer_details, customer } = stripeResponse;
  const { email, name, phone, address } = customer_details;
  // Check if user exists
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    throw error;
  }
  if (user) {
    // Update user
    const { error } = await supabase.auth.updateUser({
      data: {
        email,
        name,
        phone,
        city: address.city,
        country: address.country,
        address_line1: address.line1,
        address_line2: address.line2,
        postal_code: address.postal_code,
        state: address.state,
        stripe_customer_id: customer,
      }
    })

    if (error) {
      throw error;
    }
  }
}
