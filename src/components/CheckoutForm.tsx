import { LinkAuthenticationElement, PaymentElement, useStripe, useElements } from 'solid-stripe'

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
    <form onSubmit={handleSubmit} class="space-y-4">
      <LinkAuthenticationElement
        defaultValues={{
          email: props.customerEmail ?? ""
        }}
        onChange={(event) => props.setCustomerEmail(event.value.email)}
      />
      <PaymentElement />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Pay
      </button>
    </form>
  )
}
