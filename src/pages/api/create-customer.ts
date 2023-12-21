// src/pages/api/create-customer.ts

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({
        error: "Missing required parameter: 'email'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if a customer with the given email already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      // Customer with this email already exists, return existing customer ID
      return new Response(JSON.stringify({
        success: true,
        customerId: existingCustomers.data[0].id,
        customerEmail: existingCustomers.data[0].email,
        customerName: existingCustomers.data[0].name
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = name ? { email, name } : { email };
    // Create a new customer in Stripe
    const customer = await stripe.customers.create(data);

    return new Response(JSON.stringify({
      success: true,
      customerId: customer.id,
      customerEmail: customer.email,
      customerName: customer.name
    }), {
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
