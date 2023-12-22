import { PaymentElement, useElements, useStripe } from 'solid-stripe'

type Props = {
  onSucess: () => void;
}

export default function CheckoutForm(props: Props) {
  const stripe = useStripe()
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


    console.log({
      result, props, onSucess: props.onSucess()
    })

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message)
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  }


  return (
    <form onSubmit={handleSubmit} class="text-brand_black p-4 rounded-none flex flex-col gap-4 bg-brand_white min-h-full mx-auto w-full max-h-min">
      <PaymentElement />
      <button
        class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'
      >
        <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
          Pay
        </h1>
      </button>
    </form>
  )
}
