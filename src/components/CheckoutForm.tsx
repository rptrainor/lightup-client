import { LinkAuthenticationElement, PaymentElement, useStripe, useElements } from 'solid-stripe'

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

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


  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <LinkAuthenticationElement />
      <PaymentElement />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Pay
      </button>
    </form>
  )
}
