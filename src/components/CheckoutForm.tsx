import type { PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js'
import { createSignal } from 'solid-js';
import { LinkAuthenticationElement, PaymentElement, useStripe, useElements, PaymentRequestButton } from 'solid-stripe'

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [tipAmount, setTipAmount] = createSignal<number>(0);
  const [isCustomTip, setIsCustomTip] = createSignal<boolean>(false);
  const [customTip, setCustomTip] = createSignal<string>('');


  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    // Assign to local variables
    const stripeInstance = stripe();
    const elementsInstance = elements();

    if (!stripeInstance || !elementsInstance) {
      // Handle the case where Stripe or Elements is not yet loaded
      console.error("Stripe has not been initialized yet.")
      return
    }

    const result = await stripeInstance.confirmPayment({
      elements: elementsInstance,
      // specify redirect: 'if_required' or a `return_url`
      redirect: 'if_required',
    })

    if (result.error) {
      // payment failed
      // Handle payment failure
    } else {
      // payment succeeded
      // Handle successful payment
    }
  }

  function handleTipChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    setIsCustomTip(value === 'custom');

    if (value === 'custom') {
      setTipAmount(0);
      return;
    }
    setTipAmount(parseFloat(value));
    setCustomTip('');
  }

  function handleCustomTipChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    setCustomTip(value);
    setTipAmount(parseFloat(value) || 0);
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div>
        <label class="block mb-2 text-sm font-bold text-gray-700">
          Add a tip to support Lightup:
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
            value={customTip()}
            onChange={handleCustomTipChange}
            class="border p-2 rounded mt-2"
            placeholder="Enter custom tip amount"
          />
        )}
      </div>
      <PaymentElement />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Pay
      </button>
    </form>
  )
}
