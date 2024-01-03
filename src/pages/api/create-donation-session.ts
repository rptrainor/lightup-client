import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import type { CreateStripeCheckoutSessionPayload } from '~/stores/projectLikeStore';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extracting data from the request
    const body = await request.json();
    const {
      project_id,
      referring_id,
      project_donation_amount,
      project_donation_is_recurring,
      sucess_url,
      stripe_customer_id,
      email,
    } = body as CreateStripeCheckoutSessionPayload;

    // Check for required fields
    if (!project_id || !sucess_url || !project_donation_amount) {
      return new Response(JSON.stringify({
        error: "Missing required parameters"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const amount = project_donation_amount;
    const currency = 'usd';

    if (isNaN(amount)) {
      return new Response(JSON.stringify({
        error: "Invalid numeric values for 'amount' and/or 'tipPercent'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const sustainabilityContribution = amount * 0.20; // 20% of the donation
    // const amountString = amount.toFixed(2); // Convert to cents and to string

    const amountInCents = Math.round(amount * 100); // Convert dollars to cents
    const sustainabilityContributionInCents = Math.round(sustainabilityContribution * 100); // Convert dollars to cents

    const metadata = {
      project_id,
      sucess_url,
      referring_id,
      project_donation_amount,
      project_donation_is_recurring: project_donation_is_recurring === true ? 'yes' : 'no'
    };

    const sustaining_contribution_payload: Stripe.PriceCreateParams = {
      currency,
      unit_amount_decimal: sustainabilityContributionInCents.toString(),
      tax_behavior: 'exclusive',
      recurring: project_donation_is_recurring === true ? {
        interval: 'month'
      } : undefined,
      metadata: metadata,
      product_data: {
        name: 'Sustainability contribution',
        statement_descriptor: 'Sustainability Lightup',
        tax_code: 'txcd_90000001',
        metadata: metadata,
      },
    }

    const pricePayload: Stripe.PriceCreateParams = {
      currency,
      unit_amount_decimal: amountInCents.toString(),
      tax_behavior: 'exclusive',
      recurring: project_donation_is_recurring === true ? {
        interval: 'month'
      } : undefined,
      metadata: metadata,
      product_data: {
        name: 'Donation',
        statement_descriptor: 'Donation | Lightup',
        tax_code: 'txcd_90000001',
        metadata: metadata,
      },
    }

    const price = await stripe.prices.create(pricePayload);
    const sustainabilityContributionPrice = await stripe.prices.create(sustaining_contribution_payload);
    const mode = project_donation_is_recurring ? 'subscription' : 'payment';

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      currency,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
        {
          price: sustainabilityContributionPrice.id,
          quantity: 1,
        }
      ],
      metadata: metadata,
      mode: mode,
      ui_mode: 'embedded',
      return_url: `${sucess_url}?session_id={CHECKOUT_SESSION_ID}`, // Adjust the domain as needed
      automatic_tax: { enabled: true },
    };

    // Conditionally set 'customer' or 'customer_email'
    if (stripe_customer_id) {
      sessionConfig.customer = stripe_customer_id;
    } else if (email) {
      sessionConfig.customer_email = email;
    }

    // Only include customer_creation for 'payment' mode
    if (mode === 'payment') {
      sessionConfig.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Return the client secret for Stripe's frontend use
    return new Response(JSON.stringify({ ok: true, clientSecret: session.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
