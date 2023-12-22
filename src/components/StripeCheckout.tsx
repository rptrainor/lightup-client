import { createSignal, createResource, Suspense, onMount } from "solid-js";
import { loadStripe, type Stripe } from '@stripe/stripe-js';

async function postFormData(formData: FormData) {
  const response = await fetch("/api/create-price", {
    method: "POST",
    body: formData,
  });
  return await response.json();
}

async function createCheckoutSession(priceId: string, sustaining_membership: boolean) {
  console.log('createCheckoutSession CALLED', { priceId, sustaining_membership })
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

    console.log('priceData.sustaining_membership', priceData.sustaining_membership);
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
    <div class='flex flex-col px-4 mx-auto items-center'>
      <form onSubmit={submit}>
        <fieldset class="grid grid-cols-4 gap-2">
          <legend class='pb-2'>Choose an amount:</legend>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
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
            <div class="w-[4.5rem] h-12 bg-brand_white peer-checked:bg-brand_pink peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors">
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
        <label class="">
          Make it monthly!
        </label>
        <fieldset class="grid grid-cols-2 gap-2">
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
        <select name='tipPercent' class="w-full border-4 border-brand_black bg-brand_white text-brand_black p-2 hover:border-brand_pink focus:border-brand_pink focus:ring focus:ring-brand_pink focus:ring-opacity-50 transition ease-in-out duration-150">
          <option value={0}>0%</option>
          <option value={0.05}>5%</option>
          <option value={0.1}>10%</option>
          <option value={0.15}>15%</option>
          <option value={0.2} selected>20%</option>
          <option value={0.25}>25%</option>
          <option value={0.3}>30%</option>
          <option value={0.35}>35%</option>
          <option value={0.4}>40%</option>
          <option value={0.45}>45%</option>
          <option value={0.5}>50%</option>
          <option value={0.55}>55%</option>
          <option value={0.6}>60%</option>
          <option value={0.65}>65%</option>
          <option value={0.7}>70%</option>
          <option value={0.75}>75%</option>
          <option value={0.8}>80%</option>
          <option value={0.85}>85%</option>
          <option value={0.9}>90%</option>
          <option value={0.95}>95%</option>
          <option value={1}>100%</option>
        </select>
        <button>Send</button>
        {/* <Suspense>{response() && <p>{response().message}</p>}</Suspense> */}
      </form>
      <div id="checkout">
        {/* Checkout will insert the payment form here */}
      </div>
    </div>
  );
};

export default StripeCheckout;
