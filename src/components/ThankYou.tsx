// import { createSignal, createResource, createEffect } from 'solid-js';
import ShareButtons from './ShareButtons';
// import base64Encode from '~/utilities/base64Encode';
import { addNotification } from '~/stores/notificationStore';
// import { handleUserUpdate } from '~/utilities/handleUserUpdate';

type Props = {
  projectSlug: string;
  projectBannerSrc: string;
  refferalLinkId: string;
}

const ThankYou = (props: Props) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://lightup.fyi/${props.projectSlug}/${props.refferalLinkId}`);
      addNotification({
        type: 'success',
        header: 'Your link has been copied to your clipboard',
        subHeader: 'You can now paste it anywhere you like!'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        header: 'Something went wrong with copying your link',
        subHeader: `https://lightup.fyi/${props.projectSlug}/${props.refferalLinkId}`
      })
      console.error(error);
    }
  };

  return (
    <div id="success" class='bg-brand_white mx-auto flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 border-solid border-4 border-brand_black'>
      <h2 class="font-bold text-center text-brand_black">
        Thank you for Being A Light with your Donation
      </h2>
      <div class='flex flex-col gap-2'>
        <h3 class="font-semibold text-brand_black">Earn As You Empower:</h3>
        <p class="text-gray-600">
          You earn 10% back from the Sustainability Contributions for each donation made through your link. A simple, powerful way to support more research.
        </p>
      </div>
      <button onClick={copyToClipboard} class='bg-brand_pink sm:px-6 py-2 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 group z-20 max-w-[100vw]' data-astro-prefetch>
        <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center sm:gap-4 text-3xl sm:text-5xl">
          <span>Copy my referral link</span>
          <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
        </h1>
      </button>
      <div class='flex flex-col gap-2'>
        <h3 class="font-semibold text-brand_black">Share referral link:</h3>
        <ShareButtons text='I just donated to this project on LightUp. Join me in supporting this great cause!' url={`https://lightup.fyi/${props.projectSlug}/${props.refferalLinkId}`} image={props.projectBannerSrc} />
      </div>
    </div>
  );
};

export default ThankYou;
