import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const amountValue = formData.get('donation_amount');
    const sustaining_membership = formData.get('sustaining_membership');

    if (!amountValue || typeof amountValue !== 'string') {
      return new Response(JSON.stringify({
        error: "Invalid or missing parameters: 'amount'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const amount = parseFloat(amountValue);
    const currency = 'usd';

    if (isNaN(amount)) {
      return new Response(JSON.stringify({
        error: "Invalid numeric values for 'amount' and/or 'tipPercent'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const sustainabilityContribution = amount * 0.20; // 20% of the donation
    const sustainabilityContributionString = sustainabilityContribution.toFixed(2); // Convert to cents and to string
    const amountString = amount.toFixed(2); // Convert to cents and to string

    const amountInCents = Math.round(amount * 100); // Convert dollars to cents
    const sustainabilityContributionInCents = Math.round(sustainabilityContribution * 100); // Convert dollars to cents

    console.log({ amountInCents, sustainabilityContributionInCents, amount, sustainabilityContribution });


    const interval: Stripe.PriceCreateParams.Recurring.Interval = sustaining_membership === 'yes' ? 'month' : 'day'; // or another appropriate value
    const taxBehavior: Stripe.PriceCreateParams.TaxBehavior = 'exclusive'; // Or 'inclusive'/'unspecified' as per your requirement

    const sustaining_contribution_payload: Stripe.PriceCreateParams = sustaining_membership === 'yes' ? {
      currency,
      unit_amount_decimal: sustainabilityContributionInCents.toString(),
      tax_behavior: taxBehavior,
      recurring: {
        interval
      },
      metadata: {},
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
      metadata: {},
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

    if (!price.id) {
      return new Response(null, { status: 404, statusText: 'Price ID not found' });
    }
    const isRecurring = sustaining_membership === 'yes' ? true : false;

    return new Response(JSON.stringify({
      success: true,
      priceId: price.id,
      sustainabilityContributionPriceId: sustainabilityContributionPrice.id,
      sustaining_membership: isRecurring
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

