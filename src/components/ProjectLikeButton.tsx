import { createSignal, createEffect, Switch, Match, createResource } from "solid-js";
import {
  QueryClient,
  QueryClientProvider,
  createQuery,
} from '@tanstack/solid-query'

import StripeCheckout from "~/components/StripeCheckout";
import ThankYou from "~/components/ThankYou";
import { addNotification } from '~/stores/notificationStore';
import { handleUserUpdate } from "~/utilities/handleUserUpdate";
import { getOrCreateReferralLink } from "~/utilities/getOrCreateReferralLink";
import { handleSignInWithEmailAuth } from "~/utilities/handleSignInWithEmailAuth";
import checkLikeStatus from "~/utilities/checkLikeStatus";
import likeProject from "~/utilities/likeProject";
import { userState } from "~/stores/authStore";
import SolidQueryProvider from "~/components/SolidQueryProvider";
import fetchSupabaseUser from "~/utilities/fetchSupabaseUser";
import { queryClient } from "~/components/SolidQueryProvider";
import createFetchSupabaseUser from "~/queries/createFetchSupabaseUser";

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

type LikeButtonState = "initial" | "not_logged_in_user_sees_like_button" | "not_logged_in_user_sees_stripe_checkout" | "not_logged_in_user_sees_thank_you" | "logged_in_user_sees_like_button" | "logged_in_user_sees_stripe_checkout" | "logged_in_user_sees_thank_you"

type PayloadProps = {
  session_id: string
}

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referringUserId: string | undefined;
  session_id: string;
}

async function getStripeSession(payload: PayloadProps) {
  if (!payload.session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${payload.session_id}`);
  return await response.json();
}

const ProjectLikeButton = (props: Props) => {
  const [state, setState] = createSignal<LikeButtonState>("initial");
  const [userId, setUserId] = createSignal<string | undefined>(undefined);
  const [userLiked, setUserLiked] = createSignal<boolean | undefined>(undefined);
  const [customerEmail, setCustomerEmail] = createSignal<string | undefined>(undefined);
  const [stripeCustomerId, setStripeCustomerId] = createSignal<string | undefined>(undefined);
  const [refferalLink, setRefferalLink] = createSignal<string | undefined>(undefined);

  // const userQuery = createQuery(() => ({
  //   queryClient,
  //   queryKey: ['user'],
  //   queryFn: fetchSupabaseUser,
  //   enabled: true,
  // }))
      const userQuery = createFetchSupabaseUser();


  createEffect(() => {
    // const userId = userState().user?.id;
    // console.log('userQuery', userQuery);
    console.log('userQuery', userQuery);
    console.log('userQuery.data', userQuery.data);
    switch (state()) {
      case 'initial':
        if (!userQuery.data?.id) {
          setState('not_logged_in_user_sees_like_button');
        } else {
          setState('logged_in_user_sees_like_button');
        }
        break;
      case 'not_logged_in_user_sees_like_button':
        break;
      case 'not_logged_in_user_sees_stripe_checkout':
        break;
      case 'not_logged_in_user_sees_thank_you':
        break;
      case 'logged_in_user_sees_like_button':
        break;
      case 'logged_in_user_sees_stripe_checkout':
        break;
      case 'logged_in_user_sees_thank_you':
        break;
      default:
        break;
    }
  });


  return (
    <SolidQueryProvider>
      <Switch fallback={null}>
        <Match when={state() === 'not_logged_in_user_sees_stripe_checkout' || state() === 'logged_in_user_sees_stripe_checkout'}>
          <StripeCheckout
            projectId={props.projectId}
            projectSlug={props.projectSlug}
            sucessUrl={props.sucessUrl}
            projectBannerSrc={props.projectBannerSrc}
            projectCreatorName={props.projectCreatorName}
            referringUserId={props.referringUserId}
            onError={(() => console.log('onError'))}
          />
        </Match>
        <Match when={state() === 'not_logged_in_user_sees_like_button' || state() === 'logged_in_user_sees_like_button'}>
          <button onClick={(() => handleSignInWithEmailAuth('rptrainor@gmail.com'))} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 sticky top-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch >
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
        <Match when={state() === 'not_logged_in_user_sees_thank_you' || state() === 'logged_in_user_sees_thank_you'}>
          <ThankYou
            refferalLinkId={'refferalLinkId()'}
            projectSlug={props.projectSlug}
            projectBannerSrc={props.projectBannerSrc}
          />
        </Match>
      </Switch>
    </SolidQueryProvider>
  );
}

export default ProjectLikeButton;