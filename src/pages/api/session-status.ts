// src/pages/api/session-status.ts
import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const GET: APIRoute = async ({ url }) => {
  try {
    // Extract session_id from the query parameter
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return new Response('Session ID is required', { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return the session details
    return new Response(JSON.stringify(session), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Handle unknown errors
      return new Response('An unknown error occurred', {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
};
