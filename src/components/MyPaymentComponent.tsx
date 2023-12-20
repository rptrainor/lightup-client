import { Show, createSignal, onMount } from 'solid-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { Elements } from 'solid-stripe'

function MyPaymentComponent() {
  // Explicitly declare the type of the signal as Stripe | null
  const [stripe, setStripe] = createSignal<Stripe | null>(null)

  onMount(async () => {
    const result = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST)
    setStripe(result)
  })

  return (
    <Show when={stripe()} fallback={<div>Loading stripe...</div>}>
      <Elements stripe={stripe()}>
        {/* this is where your Stripe components go */}
      </Elements>
    </Show>
  )
}

export default MyPaymentComponent;
