type StripePayload = {
  project_id: string;
  referring_id: string | undefined;
  project_donation_amount: number;
  project_donation_is_recurring: boolean;
  sucess_url: string;
};

async function createStripeCheckoutSession(stripePayload: StripePayload) {
  if (!stripePayload.project_id || !stripePayload.sucess_url || !stripePayload.project_donation_amount) {
    return;
  }
  const response = await fetch("/api/create-donation-session", {
    method: "POST",
    body: JSON.stringify(stripePayload),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return await response.json();
}

export default createStripeCheckoutSession;