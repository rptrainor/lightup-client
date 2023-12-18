import type { APIRoute } from "astro";
const stripe = require('stripe')('sk_test_1zeMUQ64GXBwYTKDsfAEporh00JWIZHqKQ');

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const price_id = data.get("price_id");
  const quantity = data.get("quantity");
  const user_id = data.get("user_id");
  const project_id = data.get("project_id");
  const is_recurring = data.get("is_recurring");
  const referring_user_id = data.get("referring_user_id");
  const return_url = data.get("return_url");

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price_id,
        quantity: quantity,
      },
    ],
    mode: is_recurring ? 'subscription' : 'payment',
    return_url: `${return_url}/?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: { enabled: true },
    metadata: {
      price_id: price_id,
      quantity: quantity,
      user_id: user_id,
      project_id: project_id,
      is_recurring: is_recurring,
      referring_user_id: referring_user_id,
      return_url: return_url
    }
  });


  // Validate the data - you'll probably want to do more than this
  if (!price_id || !user_id || project_id || !session.client_secret) {
    return new Response(
      JSON.stringify({
        message: "Missing required fields",
      }),
      { status: 400 }
    );
  }
  // Do something with the data, then return a success response
  return new Response(
    JSON.stringify({
      message: "Success!",
      clientSecret: session.client_secret,
      session
    }),
    { status: 200 }
  );
};