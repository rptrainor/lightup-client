import { createSignal, onMount, createEffect, Show } from "solid-js";
import { loadStripe, type Stripe } from '@stripe/stripe-js';

import { context, handleUserProjectDonationAmountChange, handleUserProjectDonationIsRecurringChange, handleDonateButtonClick } from "~/stores/projectLikeStore";
import { recordErrorInPosthog } from "~/utilities/recordErrorInPosthog";

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referredByOtherUserId: string | undefined;
  onError: () => void;
};

const StripeCheckout = (props: Props) => {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);
  const [customAmountSelected, setCustomAmountSelected] = createSignal(false);

  let customAmountNumberInput: HTMLInputElement;

  const handleAmountChange = (amount: number, isCustom: boolean = false) => {
    handleUserProjectDonationAmountChange(amount);
    setCustomAmountSelected(isCustom);
    if (isCustom) {
      customAmountNumberInput?.focus();
    }
  };

  onMount(async () => {
    const stripeKey = import.meta.env.DEV
      ? import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
      : import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE;
    setStripe(await loadStripe(stripeKey));
  });

  createEffect(() => {
    if (context.stripe_client_secret) {
      stripe()?.initEmbeddedCheckout({ clientSecret: context.stripe_client_secret })
        .then(checkout => checkout.mount('#checkout'))
        .catch(error => {
          recordErrorInPosthog({ errorMessage: 'stripe().initEmbeddedCheckout returned an error', errorDetails: { context: 'StripeCheckout.tsx', error } });
          setStripe(null);
          props.onError();
        });
    }
  });

  return (
    <div class='flex flex-col mx-auto gap-4 w-full'>
      <Show when={!context.stripe_client_secret}>
        <fieldset class="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">47</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="72"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={72}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">72</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>

          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="106"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={106}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">106</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="39"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={39}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">39</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="23"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={23}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">23</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="17"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={17}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">17</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="6"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              value={6}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
            <span class="absolute z-10 text-brand_black text-center">6</span>
            <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
          </label>
          {/* Custom amount radio input with number input inside */}
          <label class="relative flex items-center justify-center">
            <input
              type="radio"
              id="custom_amount"
              name="donation_amount"
              role="radio"
              class="peer sr-only"
              checked={customAmountSelected()}
              onChange={(e) => handleAmountChange(Number(e.target.value), true)}
            />
            <div class={`w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 ${customAmountSelected() ? "bg-brand_pink ring-2 ring-brand_pink ring-offset-2 ring-offset-brand_white border-solid placeholder:text-brand_white border-brand_black border-4" : ""}`}>
              {/* Embedded custom amount number input */}
              <input
                type="number"
                min={1}
                class={`w-full h-full border-none text-center text-brand_black ${customAmountSelected() ? "placeholder:text-brand_white bg-brand_pink" : ""}`}
                placeholder="Amount"
                onInput={(e) => handleAmountChange(Number(e.target.value), true)}
                onFocus={(e) => handleAmountChange(Number(e.target.value), true)}
              />
            </div>
          </label>
        </fieldset>
        <fieldset class="grid grid-cols-2 gap-2">
          <legend class='py-2'>Make it monthly:</legend>
          <label class="relative flex items-center justify-center">
            <input checked={context.project_donation_is_recurring} onChange={() => handleUserProjectDonationIsRecurringChange(true)} type="radio" id="yes" name="sustaining_membership" role="radio" class="peer sr-only" value="yes" />
            <span class="absolute z-10 text-brand_black text-center">Yes, Let's go!</span>
            <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
          <label class="relative flex items-center justify-center">
            <input checked={!context.project_donation_is_recurring} onChange={() => handleUserProjectDonationIsRecurringChange(false)} type="radio" id="no" name="sustaining_membership" role="radio" class="peer sr-only" value={"no"} />
            <span class="absolute z-10 text-brand_black text-center">No, give once</span>
            <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
          </label>
        </fieldset>

        {/* Submit Button */}
        <button
          onClick={handleDonateButtonClick}
          class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'
          disabled={!context.project_donation_amount || !stripe()}
        >
          <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
            Donate
          </h1>
        </button>
      </Show>
      {/* CHECKOUT FORM */}
      <div id="checkout">
        {/* Checkout will insert the payment form here */}
      </div>
    </div >
  );
}

export default StripeCheckout;
