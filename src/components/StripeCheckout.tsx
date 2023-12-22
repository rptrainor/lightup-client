import { createSignal, createResource, Suspense, onMount } from "solid-js";
import { loadStripe, type Stripe } from '@stripe/stripe-js';

import CheckoutInfo from "./CheckoutInfo";
async function postFormData(formData: FormData) {
  const response = await fetch("/api/create-price", {
    method: "POST",
    body: formData,
  });
  return await response.json();
}

async function createCheckoutSession(priceId: string, sustaining_membership: boolean) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId, sustaining_membership }),
  });
  return await response.json();
}

const StripeCheckout = () => {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const priceData = await postFormData(data);

    if (priceData && priceData.priceId && priceData.sustaining_membership) {
      const checkoutSession = await createCheckoutSession(priceData.priceId, priceData.sustaining_membership);

      if (checkoutSession.clientSecret) {
        const stripeInstance = stripe();
        if (stripeInstance) {
          try {
            const checkout = await stripeInstance.initEmbeddedCheckout({ clientSecret: checkoutSession.clientSecret });
            checkout.mount('#checkout');
          } catch (error) {
            console.error('Error initializing Stripe Checkout:', error);
          }
        }
      }
    }
  };

  onMount(async () => {
    const stripeKey = import.meta.env.DEV
      ? import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
      : import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE;
    setStripe(await loadStripe(stripeKey));
  });

  return (
    <div class='flex flex-col px-4 mx-auto items-center gap-4'>
      <CheckoutInfo />

      <form onSubmit={submit} class="flex flex-col gap-2">
        <fieldset class="grid grid-cols-4 gap-2">
          <legend class="py-2">100% Direct Impact: Your chosen amount goes entirely to the cause</legend>
          <label class="relative flex items-center justify-center">
            <input
              checked
              aria-checked="true"
              type="radio"
              id="47"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={47}
            />
            <span class="absolute z-10 text-brand_black">&dollar;47</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="72"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={72}
            />
            <span class="absolute z-10 text-brand_black">&dollar;72</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>

          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="106"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={106}
            />
            <span class="absolute z-10 text-brand_black">&dollar;106</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="39"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={39}
            />
            <span class="absolute z-10 text-brand_black">&dollar;39</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="23"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={23}
            />
            <span class="absolute z-10 text-brand_black">&dollar;23</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="17"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={17}
            />
            <span class="absolute z-10 text-brand_black">&dollar;17</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="6"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={6}
            />
            <span class="absolute z-10 text-brand_black">&dollar;6</span>
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          {/* Custom amount input */}
          <label class="relative flex flex-col items-center justify-center text-brand_black">
            <input
              type="radio"
              id="custom_amount_radio"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value="custom"
            />
            <div class="w-[4.5rem] sm:w-[5.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
              <input
                type="number"
                min={0}
                incremental
                id="custom_amount"
                name="custom_amount"
                placeholder="$"
                class="w-full h-full text-center border-0 peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black p-2 peer-focus:border-brand_pink peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand_pink transition-colors disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </label>
        </fieldset>
        <fieldset class="grid grid-cols-2 gap-2">
          <legend class='py-2'>Make it monthly:</legend>
          <label class="relative flex items-center justify-center">
            <input checked type="radio" id="yes" name="sustaining_membership" role="radio" class="peer sr-only" value="yes" />
            <span class="absolute z-10 text-brand_black">Yes, Let's go!</span>
            <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input type="radio" id="no" name="sustaining_membership" role="radio" class="peer sr-only" value={"no"} />
            <span class="absolute z-10 text-brand_black">No, give once</span>
            <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
        </fieldset>

        {/* Submit Button */}
        <button type='submit'
          class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'
        >
          <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
            Donate
          </h1>
        </button>

        {/* <Suspense>{response() && <p>{response().message}</p>}</Suspense> */}
      </form>
      <div id="checkout">
        {/* Checkout will insert the payment form here */}
      </div>
    </div>
  );
};

export default StripeCheckout;
