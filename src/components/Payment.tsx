import { createSignal, Show, onMount, createEffect } from 'solid-js'
import { Elements } from 'solid-stripe'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import CheckoutForm from './CheckoutForm'

type HandlePaymentIntentProps = {
  amount: number;
  currency: string;
  tip: number;
}

export default function Payment() {
  const [stripe, setStripe] = createSignal<Stripe | null>(null)
  const [clientSecret, setClientSecret] = createSignal<string | undefined>(undefined)
  const [amount, setAmount] = createSignal<number>(0)
  const [tipAmount, setTipAmount] = createSignal<number>(0);
  const [isCustomTip, setIsCustomTip] = createSignal(false);
  // IBAN: Test account number: DE89370400440532013000
  const [currency, setCurrency] = createSignal('usd');


  onMount(async () => {
    const stripeResult = await loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST)
    setStripe(stripeResult)

    // Example: Choosing currency based on some condition or user selection
    // const currency = "usd"; // This can be dynamic based on your application's logic
    // const tip = 4200 * 0.2; // Initialize tip amount (can be updated based on user input)
    // const amount = 4200; // Example amount in cents (or the currency's smallest unit)

    // const secret = await createPaymentIntent(amount, currency, tip);
    // setClientSecret(secret);
  })

  async function createPaymentIntent({ amount, currency, tip }: HandlePaymentIntentProps): Promise<string | undefined> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, currency, tip }),
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

  function handleTipChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // setIsCustomTip(value === 'custom');

    if (value === 'custom') {
      setIsCustomTip(true)
      return;
    }
    setTipAmount(parseFloat(value));
  }

  const handlePaymentIntent = async () => {
    const secret = await createPaymentIntent({ amount: amount(), currency: currency(), tip: tipAmount() });
    setClientSecret(secret);
  }

  createEffect(() => {
    console.log("Payment:", {
      amount: amount(),
      currency: currency(),
      tip: tipAmount(),
    });
  })

  return (
    <div class='flex flex-col gap-4 w-full'>
      <h1>How much do you want to donate?</h1>
      <input
        type='number'
        class="border p-2 rounded mt-2"
        value={amount()}
        onChange={(event: Event) => setAmount(parseFloat((event.target as HTMLInputElement).value) || 0)}
      />
      <label class="block mb-2 text-sm font-bold text-gray-700">
        Add a tip to support Lightup (percentages are rounded to the nearest whole dollar amount):
      </label>
      <select onChange={handleTipChange} class="border p-2 rounded">
        <option value="0">No Tip</option>
        <option value="5">5%</option>
        <option value="10">10%</option>
        <option value="15">15%</option>
        <option value="custom">Custom Amount</option>
      </select>
      {isCustomTip() && (
        <input
          type="number"
          value={tipAmount()}
          onChange={(event: Event) => setTipAmount(parseFloat((event.target as HTMLInputElement).value) || 0)}
          class="border p-2 rounded mt-2"
          placeholder="Enter custom tip amount"
        />
      )}
      <label class="block mb-2 text-sm font-bold text-gray-700">
        Select currency:
      </label>
      <select onChange={(event: Event) => setCurrency((event.target as HTMLInputElement).value)} class="border p-2 rounded">
        <option value="usd">USD</option>
        <option value="eur">EUR</option>
      </select>
      <button onClick={() => handlePaymentIntent()}>Donate</button>
      <Show when={stripe() && clientSecret()}>
        <Elements stripe={stripe()} clientSecret={clientSecret()}>
          <CheckoutForm />
        </Elements>
      </Show>
    </div>
  )
}
