import type { APIRoute } from "astro";
const stripe = require('stripe')('sk_test_1zeMUQ64GXBwYTKDsfAEporh00JWIZHqKQ');

export const GET: APIRoute = async ({ params }) => {
  const session = await stripe.checkout.sessions.retrieve(params.session_id);

  return new Response(JSON.stringify({
    message: "success on the get",
    status: session.status,
    customer_email: session.customer_details.email
  })
  )
}