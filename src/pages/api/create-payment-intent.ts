import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      amount, currency, tipAmount, referring_userId, projectId, totalAmount
    } = await request.json();

    if (!amount || !currency) {
      return new Response(JSON.stringify({
        error: "Missing required parameters: 'amount' and/or 'currency'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Determine payment method types based on currency or other logic
    let paymentMethodTypes = ['card'];
    if (currency === 'eur') {
      paymentMethodTypes.push('sepa_debit');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        projectId,
        referring_userId,
        tipAmount,
        amount,
        totalAmount,
        currency
      }
    });

    if (!paymentIntent.client_secret) {
      return new Response(null, { status: 404, statusText: 'clientSecret not found' });
    }

    return new Response(JSON.stringify({ success: true, clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};