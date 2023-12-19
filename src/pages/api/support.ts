import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV
console.log("GET - isDev", isDev);

const STRIPE_SECRET_KEY = isDev ? import.meta.env.PUBLIC_STRIPE_SECRET_KEY_TEST : import.meta.env.PUBLIC_STRIPE_SECRET_KEY_LIVE
console.log("GET - STRIPE_SECRET_KEY", STRIPE_SECRET_KEY);

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const GET: APIRoute = async ({ request, redirect }) => {

  // Extract parameters from the request
  const url = new URL(request.url);
  const user_id = url.searchParams.get('user_id');
  const project_id = url.searchParams.get('project_id');

  if (!project_id) {
    return new Response(JSON.stringify({
      error: "Missing required parameter: 'project_id'"
    }), {
      status: 400, // Bad Request
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const redirect_url = deriveRedirectUrl(project_id);

  console.log("GET - redirect_url", redirect_url)
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: 'price_1OOTAoHaHTMpqSesSRBFJzdi',
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
          }
        },
      ],
    })
    console.log("Payment link created:", paymentLink);
    // Redirect to Stripe Payment Link
    if (!paymentLink.url) {
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    return new Response(JSON.stringify({ url: paymentLink.url }), {
      status: 307,
      headers: {
        // Location: paymentLink.url,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

function deriveRedirectUrl(project_id: string): string {
  const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:8788'
    : 'https://lightup.fyi';

  const GROW_PAGE_URLS: { [key: string]: string } = {
    'aa879726-b172-4890-968a-992bc93d77ac': `${BASE_URL}/dr-carl-june-cancer-immunotherapy/grow`
    // Add more entries as needed
  };

  return GROW_PAGE_URLS[project_id] ?? BASE_URL;
}
