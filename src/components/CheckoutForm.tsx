import { PaymentElement, useStripe, useElements } from 'solid-stripe'

type CheckoutFormProps = {
  customerId: string | undefined;
  customerEmail: string | undefined;
  customerName: string | undefined;
  setCustomerEmail: (email: string | undefined) => void;
}

export default function CheckoutForm(props: CheckoutFormProps) {
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

    console.log('handleSubmit', { result })

    if (result.error) {
      // payment failed
      // Handle payment failure
    } else {
      // payment succeeded
      console.log("Payment succeeded!", { result })
      // Handle successful payment
    }
  }


  return (
    <form onSubmit={handleSubmit} class="text-brand_black p-4 rounded-none flex flex-col gap-4 bg-brand_white min-h-full">
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
