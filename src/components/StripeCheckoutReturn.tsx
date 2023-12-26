import { createSignal, createResource, createEffect } from 'solid-js';
import ShareButtons from './ShareButtons';
import base64Encode from '~/utilities/base64Encode';

type PayloadProps = {
  session_id: string;
}

type Props = {
  session_id: string;
  onError: () => void;
  projectSlug: string;
  projectBannerSrc: string;
}

async function getStripeSession(payload: PayloadProps) {
  if (!payload.session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${payload.session_id}`);
  return await response.json();
}

const StripeCheckoutReturn = (props: Props) => {
  const [customerEmail, setCustomerEmail] = createSignal('');
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [payload, setPayload] = createSignal(props);
  const [response] = createResource(payload, getStripeSession);

  createEffect(() => {
    if (props.session_id) {
      setPayload(props);
    }
  });

  createEffect(() => {
    if (response()) {
      if (response().status === 'open') {
        props.onError();
      } else if (response().status === 'complete') {
        setShowSuccess(true);
        setCustomerEmail(base64Encode(response().customer_details.email));
      }
    }
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://lightup.fyi/${props.projectSlug}/${customerEmail() ?? ''}`);
      //TODO: TELL THE USER VIA NOTIFICATION THAT THE LINK IS COPIED
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="success" class='bg-brand_white mx-auto flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 border-solid border-4 border-brand_black' classList={{ hidden: !showSuccess() }}>
      <h2 class="text-2xl font-bold text-center text-brand_black">
        Thank you for Being A Light with your Donation
      </h2>
      <div>
        <h3 class="font-semibold text-brand_black">Earn As You Empower:</h3>
        <p class="text-gray-600">
          You earn 10% back from the Sustainability Contributions for each donation made through your link. A simple, powerful way to support more research.
        </p>
      </div>
      <button onClick={copyToClipboard} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 sticky top-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch>
        <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center sm:gap-4">
          <span>Copy my referral link</span>
          <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
        </h1>
      </button>
      <div>
        <h3 class="font-semibold text-brand_black">Share referral link:</h3>
        <ShareButtons text='I just donated to this project on LightUp. Join me in supporting this great cause!' url={`https://lightup.fyi/${props.projectSlug}/${customerEmail() ?? ''}`} image={props.projectBannerSrc} />
      </div>
    </div>
  );
};

export default StripeCheckoutReturn;
