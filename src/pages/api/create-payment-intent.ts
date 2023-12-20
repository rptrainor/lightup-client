import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV
console.log("GET - isDev", isDev);

const STRIPE_SECRET_KEY = isDev ? import.meta.env.PUBLIC_STRIPE_SECRET_KEY_TEST : import.meta.env.PUBLIC_STRIPE_SECRET_KEY_LIVE
console.log("GET - STRIPE_SECRET_KEY", STRIPE_SECRET_KEY);

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { amount } = await request.json();

    console.log("POST - amount", amount)
    if (!amount) {
      return new Response(JSON.stringify({
        error: "Missing required parameter: 'amount'"
      }), {
        status: 400, // Bad Request
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      // note, for some EU-only payment methods it must be EUR
      currency: 'usd',
      // specify what payment methods are allowed
      // can be card, sepa_debit, ideal, etc...
      payment_method_types: ['card'],
    })

    if (!paymentIntent.client_secret) {
      return new Response(null, {
        status: 404,
        statusText: 'clientSecret: paymentIntent.client_secret Not found'
      });
    }

    return new Response(JSON.stringify({ success: true, clientSecret: paymentIntent.client_secret }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};