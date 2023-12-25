import { createSignal, createEffect, Switch, Match } from "solid-js";

import ThankYouLetter from "~/components/ThankYouLetter";
import ShareButtons from "~/components/ShareButtons";

import CheckoutInfo from "./CheckoutInfo";
import StripeCheckout from "./StripeCheckout";

type Area = {
  header: string,
  body: string
}

export type Project = {
  id: string;
  title: string;
  description: string;
  header: string;
  slug: string;
  tags: string[];
  banner: {
    src: string;
    alt: string;
  };
  creator: {
    name: string;
    avatar: {
      src: string;
      alt: string;
    };
  };
  areas: Area[],
  callToAction: string,
}

type LikeButtonState = "initial" | "render_button" | "render_info" | "render_payment" | 'render_checkout' | "render_share_buttons";

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referringUserId: string | undefined
}

const ProjectLikeButton = (props: Props) => {
  const [state, setState] = createSignal<LikeButtonState>("render_button");

  createEffect(() => {
    console.log('state: ', state());
  });

  return (
    <Switch fallback={null}>
      <Match when={state() === 'render_info'}>
        <CheckoutInfo onClick={() => setState("render_payment")} />
      </Match>
      <Match when={state() === 'render_payment'}>
        <StripeCheckout
          projectId={props.projectId}
          projectSlug={props.projectSlug}
          sucessUrl={props.sucessUrl}
          projectBannerSrc={props.projectBannerSrc}
          projectCreatorName={props.projectCreatorName}
          referringUserId={props.referringUserId}
        />
      </Match>
      <Match when={state() === 'render_button'}>
        <button onClick={() => setState("render_payment")} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 fixed sm:sticky sm:top-0 bottom-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch >
          <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
            <span>Like</span>
            <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
          </h1>
        </button>
      </Match>
      <Match when={state() === 'render_share_buttons'}>
        <div class='flex flex-col max-w-6xl p-4 gap-4 mx-auto'>
          <h1 class='text-brand_yellow'>We Shine Brighter Together</h1>
          <h1 class='text-brand_yellow'>Thank You for Being a Light</h1>
          <h2 class='text-center'>
            Empower & Earn: Receive a Generous 10% Reward for Every Donation Made via
            Your Link!
          </h2>
          <ShareButtons
            url={`https://lightup.fyi/${props.projectSlug}`}
            text='I just donated to this project on LightUp. Join me in supporting this great cause!'
            image={props.projectBannerSrc}
          />
          <ThankYouLetter
            creatorName={props.projectCreatorName}
          />
        </div>
      </Match>
    </Switch>
  );
}

export default ProjectLikeButton;