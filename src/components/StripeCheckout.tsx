import { createSignal, createResource, createEffect, onMount, createMemo } from "solid-js";
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { set } from "zod";

type StripePayload = {
  amountValue: number;
  isSustainingMembership: boolean;
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referringUserId: string | undefined;
  isCheckingOut: boolean;
};

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referringUserId: string | undefined;
};

async function postFormData(stripePayload: StripePayload) {
  if (!stripePayload.isCheckingOut) {
    return;
  }
  const response = await fetch("/api/create-donation-session", {
    method: "POST",
    body: JSON.stringify(stripePayload),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  return data;
}

export default function StripeCheckout(props: Props) {
  const [stripe, setStripe] = createSignal<Stripe | null>(null);
  const [amountValue, setAmountValue] = createSignal(47);
  const [isSustainingMembership, setIsSustainingMembership] = createSignal(false);
  const [customAmountSelected, setCustomAmountSelected] = createSignal(false);
  const [stripePayload, setStripePayload] = createSignal<StripePayload>({
    amountValue: 47,
    isSustainingMembership: false,
    projectId: props.projectId,
    projectSlug: props.projectSlug,
    sucessUrl: props.sucessUrl,
    projectBannerSrc: props.projectBannerSrc,
    projectCreatorName: props.projectCreatorName,
    referringUserId: props.referringUserId,
    isCheckingOut: false,
  });
  const [response] = createResource(stripePayload, postFormData);

  const handleCustomAmountRadioChange = () => {
    setCustomAmountSelected(true);
    setAmountValue(0); // Reset or set to a default custom amount
  };

  const handlePresetAmountRadioChange = (amount: number) => {
    setCustomAmountSelected(false);
    setAmountValue(amount);
  };

  const handleAmountChange = (amount: number) => {
    setAmountValue(amount);
  };

  const handleCustomAmountChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    const numValue = value ? parseInt(value, 10) : 0;
    setAmountValue(numValue);
  };

  const isCustomSelected = () => {
    const amount = amountValue();
    return amount === null || ![47, 72, 106, 39, 23, 17, 6].includes(amount);
  };

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    console.log(amountValue(), isSustainingMembership());
    setStripePayload({
      amountValue: amountValue(),
      isSustainingMembership: isSustainingMembership(),
      projectId: props.projectId,
      projectSlug: props.projectSlug,
      sucessUrl: props.sucessUrl,
      projectBannerSrc: props.projectBannerSrc,
      projectCreatorName: props.projectCreatorName,
      referringUserId: props.referringUserId,
      isCheckingOut: true,
    });
  }

  onMount(async () => {
    const stripeKey = import.meta.env.DEV
      ? import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST
      : import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE;
    setStripe(await loadStripe(stripeKey));
  });

  createEffect(() => {
    const checkoutResponse = response();
    if (checkoutResponse && checkoutResponse.clientSecret) {
      const stripeInstance = stripe();
      if (stripeInstance) {
        try {
          stripeInstance.initEmbeddedCheckout({ clientSecret: checkoutResponse.clientSecret })
            .then(checkout => {
              checkout.mount('#checkout');
            })
            .catch(error => {
              console.error('Error initializing Stripe Checkout:', error);
            });
        } catch (error) {
          console.error('Error initializing Stripe Checkout:', error);
        }
      }
    }
  });

  const radioInputClass = (amount: number) => {
    console.log('customAmountSelected()', customAmountSelected());
    console.log('amount', amount);
    console.log('conditional', customAmountSelected() && amountValue() !== amount);
    return `w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors ${customAmountSelected() && amountValue() !== amount ? 'bg-brand_white' : 'peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4'
      }`;
  };

  createEffect(() => {
    console.log('response()', response());
    console.log('isCustomSelected()', isCustomSelected());
  });

  return (
    <div class='flex flex-col px-4 mx-auto gap-4'>
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
          <span class="absolute z-10 text-brand_black">&dollar;47</span>
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
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <span class="absolute z-10 text-brand_black">&dollar;72</span>
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
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <span class="absolute z-10 text-brand_black">&dollar;106</span>
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
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <span class="absolute z-10 text-brand_black">&dollar;39</span>
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
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <span class="absolute z-10 text-brand_black">&dollar;23</span>
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
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <span class="absolute z-10 text-brand_black">&dollar;17</span>
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
          <span class="absolute z-10 text-brand_black">&dollar;6</span>
          <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
        </label>
        {/* Custom amount radio input */}
        <label class="relative flex items-center justify-center">
          <input
            type="radio"
            id="custom_amount"
            name="donation_amount"
            role="radio"
            class="peer sr-only"
            checked={isCustomSelected()}
            onChange={(e) => handlePresetAmountRadioChange(Number(e.target.value))}
          />
          <input 
          aria-label="custom"
          class="absolute z-10 
          text-brand_black w-16 h-5" 
          />
          <div class="w-full h-12 bg-brand_white border-brand_black flex items-center justify-center transition-colors peer-checked:bg-brand_pink peer-checked:ring-2 peer-checked:ring-brand_pink peer-checked:ring-offset-2 peer-checked:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4"></div>
        </label>
      </fieldset>
      <fieldset class="grid grid-cols-2 gap-2">
        <legend class='py-2'>Make it monthly:</legend>
        <label class="relative flex items-center justify-center">
          <input checked={isSustainingMembership()} onChange={() => setIsSustainingMembership(true)} type="radio" id="yes" name="sustaining_membership" role="radio" class="peer sr-only" value="yes" />
          <span class="absolute z-10 text-brand_black">Yes, Let's go!</span>
          <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
        </label>
        <label class="relative flex items-center justify-center">
          <input checked={!isSustainingMembership()} onChange={() => setIsSustainingMembership(false)} type="radio" id="no" name="sustaining_membership" role="radio" class="peer sr-only" value={"no"} />
          <span class="absolute z-10 text-brand_black">No, give once</span>
          <div class="w-full h-12 bg-brand_white peer-checked:bg-brand_pink peer-focus:ring-2 peer-focus:ring-brand_pink peer-focus:ring-offset-2 peer-focus:ring-offset-brand_white peer-checked:border-solid peer-checked:border-4 border-brand_black flex items-center justify-center transition-colors"></div>
        </label>
      </fieldset>

      {/* Submit Button */}
      <button onClick={handleClick}
        class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'
      >
        <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
          Donate
        </h1>
      </button>

      {/* CHECKOUT FORM */}
      <div id="checkout">
        {/* Checkout will insert the payment form here */}
      </div>
    </div >
  );
}
