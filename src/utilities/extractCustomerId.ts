function extractCustomerId(stripeCustomerId: string): string {
  // Assuming all customer IDs start with 'cus_' and are at least as long as the prefix
  if (stripeCustomerId.startsWith('cus_')) {
    return stripeCustomerId.substring(4); // 'cus_' is 4 characters long
  }

  // Handle the case where the string does not start with 'cus_'
  console.warn('Invalid Stripe customer ID:', stripeCustomerId);
  return stripeCustomerId;
}

export default extractCustomerId;

