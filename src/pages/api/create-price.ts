import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    console.log('formData', formData);
    const amountValue = formData.get('donation_amount');
    const tipPercentValue = formData.get('tipPercent');
    const sustaining_membership = formData.get('sustaining_membership');
    console.log('amountValue', amountValue);
    console.log('tipPercentValue', tipPercentValue);

    if (!amountValue || typeof amountValue !== 'string' || !tipPercentValue || typeof tipPercentValue !== 'string') {
      return new Response(JSON.stringify({
        error: "Invalid or missing parameters: 'amount' and/or 'tipPercent'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const amount = parseFloat(amountValue);
    const tipPercent = parseFloat(tipPercentValue);
    const currency = 'usd';

    if (isNaN(amount) || isNaN(tipPercent)) {
      return new Response(JSON.stringify({
        error: "Invalid numeric values for 'amount' and/or 'tipPercent'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const totalAmount = calculateTotalAmount(amount, tipPercent);
    const totalAmountString = (totalAmount * 100).toFixed(0); // Convert to cents and to string

    const interval: Stripe.PriceCreateParams.Recurring.Interval = sustaining_membership === 'yes' ? 'month' : 'day'; // or another appropriate value
    const taxBehavior: Stripe.PriceCreateParams.TaxBehavior = 'exclusive'; // Or 'inclusive'/'unspecified' as per your requirement

    const pricePayload = sustaining_membership === 'yes' ? {
      currency,
      unit_amount_decimal: totalAmountString,
      tax_behavior: taxBehavior,
      recurring: {
        interval
      },
      metadata: {
        donation_amount: amount.toString(),
        currency,
        tipPercent: tipPercent.toString(),
      },
      product_data: {
        name: 'Donation',
        statement_descriptor: 'Donation via Lightup',
        tax_code: 'txcd_90000001',
        metadata: {
          donation_amount: amount.toString(),
          currency,
          tipPercent: tipPercent.toString(),
        }
      },
    } : {
      currency,
      unit_amount_decimal: totalAmountString,
      tax_behavior: taxBehavior,
      metadata: {
        donation_amount: amount.toString(),
        currency,
        tipPercent: tipPercent.toString(),
      },
      product_data: {
        name: 'Donation',
        statement_descriptor: 'Donation via Lightup',
        tax_code: 'txcd_90000001',
        metadata: {
          donation_amount: amount.toString(),
          currency,
          tipPercent: tipPercent.toString(),
        }
      },
    }

    const price = await stripe.prices.create(pricePayload);

    if (!price.id) {
      return new Response(null, { status: 404, statusText: 'Price ID not found' });
    }
    const isRecurring = sustaining_membership === 'yes' ? true : false;
    console.log('sustaining_membership', sustaining_membership);
    console.log('isRecurring', isRecurring);
    return new Response(JSON.stringify({ success: true, priceId: price.id, sustaining_membership: isRecurring }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

function calculateTotalAmount(amount: number, tipPercent: number): number {
  // Convert the tip percent into a decimal if it's in percentage form
  if (tipPercent > 1) {
    tipPercent = tipPercent / 100;
  }

  // Calculate the tip amount
  const tipAmount = amount * tipPercent;

  // Calculate the total amount by adding the tip amount to the original amount
  return Math.round((amount + tipAmount) * 100) / 100;
}
