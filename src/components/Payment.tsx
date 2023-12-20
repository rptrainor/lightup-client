import { createSignal, Show, onMount } from 'solid-js'
import { Elements } from 'solid-stripe'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'

export default function Payment() {
  const [stripe, setStripe] = createSignal<Stripe | null>(null)
  const [clientSecret, setClientSecret] = createSignal<string | undefined>(undefined)

  onMount(async () => {
    const stripeResult = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST)
    setStripe(stripeResult)

    const secret = await createPaymentIntent(4200) // Example amount in cents
    setClientSecret(secret)
  })

  async function createPaymentIntent(amount: number): Promise<string | undefined> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return undefined;
    }
  }

  return (
    <Show when={stripe() && clientSecret()}>
      <Elements stripe={stripe()} clientSecret={clientSecret()}>
        <CheckoutForm />
      </Elements>
    </Show>
  )
}
