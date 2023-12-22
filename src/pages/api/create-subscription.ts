// src/pages/api/create-subscription.ts

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const isDev = import.meta.env.DEV;
const STRIPE_SECRET_KEY = isDev ? import.meta.env.STRIPE_SECRET_KEY_TEST : import.meta.env.STRIPE_SECRET_KEY_LIVE;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      customerId,
      priceId,
      amount,
      tipPercent,
      referring_userId,
      projectId,
      totalAmount,
      currency
    } = await request.json();
    // Convert amount and tip from string to number

    // Validate the numeric values
    if (
      isNaN(Number(amount)) ||
      isNaN(Number(tipPercent)) ||
      isNaN(Number(totalAmount))
    ) {
      return new Response(JSON.stringify({
        error: "Invalid amount, tipPercent, or totalAmount"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Check if totalAmount is valid
    if (totalAmount <= 0) {
      return new Response(JSON.stringify({
        error: "Total amount must be greater than zero"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!customerId || !priceId) {
      return new Response(JSON.stringify({
        error: "Missing required parameters: 'customerId' and/or 'priceId'"
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity: totalAmount }],
      metadata: {
        projectId,
        referring_userId,
        tipPercent,
        amount,
        totalAmount,
        currency
      },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Check if latest_invoice is null or a string
    if (!subscription.latest_invoice || typeof subscription.latest_invoice === 'string') {
      return new Response(JSON.stringify({
        error: "Failed to retrieve latest invoice from the subscription"
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Ensure that payment_intent exists and is not a string
    const paymentIntent = subscription.latest_invoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === 'string' || !paymentIntent.client_secret) {
      return new Response(JSON.stringify({
        error: "Failed to retrieve client secret from payment intent"
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
