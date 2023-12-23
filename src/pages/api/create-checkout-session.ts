// src/pages/api/create-checkout-session.ts

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { priceId, sustaining_membership, sustainabilityContributionPriceId } = await request.json(); // Extract priceId from the request body
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: sustainabilityContributionPriceId,
          quantity: 1,
        },
        {
          price: priceId,
          quantity: 1,
        }
      ],
      mode: sustaining_membership ? 'subscription' : 'payment',
      return_url: `http://localhost:8788/checkout?session_id={CHECKOUT_SESSION_ID}`, // Adjust the domain as needed
      automatic_tax: { enabled: true },
    });
    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    // For non-Error types, return a generic message
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
