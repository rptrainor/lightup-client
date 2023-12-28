import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    // Extracting data from the request
    const body = await request.json();
    const {
      projectId,
      projectSlug,
      sucessUrl,
      projectBannerSrc,
      projectCreatorName,
      referringUserId,
      amountValue,
      sustaining_membership
    } = body;

    // Check for required fields
    if (!projectId || !projectSlug || !sucessUrl || !amountValue) {
      return new Response(JSON.stringify({
        error: "Missing required parameters"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const amount = parseFloat(amountValue as string);
    const currency = 'usd';

    if (isNaN(amount)) {
      return new Response(JSON.stringify({
        error: "Invalid numeric values for 'amount' and/or 'tipPercent'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const sustainabilityContribution = amount * 0.20; // 20% of the donation
    const amountString = amount.toFixed(2); // Convert to cents and to string

    const amountInCents = Math.round(amount * 100); // Convert dollars to cents
    const sustainabilityContributionInCents = Math.round(sustainabilityContribution * 100); // Convert dollars to cents

    const interval: Stripe.PriceCreateParams.Recurring.Interval = sustaining_membership === 'yes' ? 'month' : 'day'; // or another appropriate value
    const taxBehavior: Stripe.PriceCreateParams.TaxBehavior = 'exclusive'; // Or 'inclusive'/'unspecified' as per your requirement

    const sustaining_contribution_payload: Stripe.PriceCreateParams = sustaining_membership === 'yes' ? {
      currency,
      unit_amount_decimal: sustainabilityContributionInCents.toString(),
      tax_behavior: taxBehavior,
      recurring: {
        interval
      },
      metadata: {
        projectId,
        projectSlug,
        sucessUrl,
        projectBannerSrc,
        projectCreatorName,
        referringUserId,
        amountValue,
        sustaining_membership
      },
      product_data: {
        name: 'Sustainability contribution',
        statement_descriptor: 'Sustainability Lightup',
        tax_code: 'txcd_90000001',
        metadata: {}
      },
    } : {
      currency,
      unit_amount_decimal: sustainabilityContributionInCents.toString(),
      tax_behavior: taxBehavior,
      metadata: {
        projectId,
        projectSlug,
        sucessUrl,
        projectBannerSrc,
        projectCreatorName,
        referringUserId,
        amountValue,
        sustaining_membership
      },
      product_data: {
        name: 'Sustainability contribution',
        statement_descriptor: 'Sustainability Lightup',
        tax_code: 'txcd_90000001',
        metadata: {}
      },
    }

    const metadata = {
      donation_amount: amountString,
      currency: currency,
      projectId,
      projectSlug,
      sucessUrl,
      projectBannerSrc,
      projectCreatorName,
      referringUserId,
      amountValue,
      sustaining_membership
    };

    const pricePayload: Stripe.PriceCreateParams = sustaining_membership === 'yes' ? {
      currency,
      unit_amount_decimal: amountInCents.toString(),
      tax_behavior: taxBehavior,
      recurring: {
        interval
      },
      metadata: metadata,
      product_data: {
        name: 'Donation',
        statement_descriptor: 'Donation | Lightup',
        tax_code: 'txcd_90000001',
      },
    } : {
      currency,
      unit_amount_decimal: amountInCents.toString(),
      tax_behavior: taxBehavior,
      metadata: metadata,
      product_data: {
        name: 'Donation',
        statement_descriptor: 'Donation via Lightup',
        tax_code: 'txcd_90000001',
      },
    };

    const price = await stripe.prices.create(pricePayload);
    const sustainabilityContributionPrice = await stripe.prices.create(sustaining_contribution_payload);

    const session = await stripe.checkout.sessions.create({
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
      metadata: {},
      mode: sustaining_membership === 'yes' ? 'subscription' : 'payment',
      ui_mode: 'embedded',
      customer_creation: 'always',
      return_url: `${sucessUrl}?session_id={CHECKOUT_SESSION_ID}`, // Adjust the domain as needed
      automatic_tax: { enabled: true },
    });

    // Return the client secret for Stripe's frontend use
    return new Response(JSON.stringify({ ok: true, clientSecret: session.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
