import { createSignal, createEffect, Switch, Match, onMount } from "solid-js";

import StripeCheckout from "~/components/StripeCheckout";
import ThankYou from "~/components/ThankYou";
import { addNotification } from '~/stores/notificationStore';
import { handleUserUpdate } from "~/utilities/handleUserUpdate";
import handleStripeSession from "~/utilities/handleStripeSession";
import extractCustomerId from "~/utilities/extractCustomerId";
import { state, context } from '~/stores/projectLikeStore'
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

export type RefferalLink = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  stripe_customer_id: string | null;
  email: string | null;
  user_id: string | null;
  project_id: string | null;
};

type LikeButtonState = "initial" | "not_logged_in_user_sees_like_button" | "not_logged_in_user_sees_stripe_checkout" | "not_logged_in_user_sees_thank_you" | "logged_in_user_sees_like_button" | "logged_in_user_sees_stripe_checkout" | "logged_in_user_sees_thank_you"

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referringUserId: string | undefined;
  session_id: string;
}

const ProjectLikeButton = (props: Props) => {
  const [localState, setState] = createSignal<LikeButtonState>("initial");
  const [userLiked, setUserLiked] = createSignal<boolean | null>(null);
  const [sessionId, setSessionId] = createSignal<string | null>(null);
  const [customerEmail, setCustomerEmail] = createSignal<string | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = createSignal<string | null>(null);
  const [refferalLink, setRefferalLink] = createSignal<RefferalLink | null>(null);

  const handleStripeCheckoutError = () => {
    setState('initial')
    addNotification({ type: 'error', header: 'Looks like something went wrong', subHeader: 'There was an error processing your payment. Please try again.' });
  };

  // const handleLikeButtonClick = () => {
  //   setUserLiked(true);
  //   if (userState().user?.id && props.projectId) {
  //     likeProject({ projectId: props.projectId, userId: userState().user?.id }).then(() => {
  //       setState('logged_in_user_sees_stripe_checkout');
  //     });
  //   } else {
  //     setState('not_logged_in_user_sees_stripe_checkout');
  //   }
  // };

  // createEffect(() => {
  //   const userId = userState().user?.id;
  //   const email = customerEmail();
  //   if (!userId && email) {
  //     handleSignInWithEmailAuth(email);
  //   }
  // })

  createEffect(() => {
    const fetchStripeSession = async () => {
      if (props.session_id) {
        setSessionId(props.session_id);
        const sessionData = await handleStripeSession(props.session_id);
        if (sessionData) {
          setStripeCustomerId(sessionData.customer);
          handleUserUpdate(sessionData);
          setCustomerEmail(sessionData.customer_details.email);
        }
      }
    };
    fetchStripeSession();
  });

  // createEffect(() => {
  //   const userId = userState().user?.id;
  //   const email = userState().user?.email;
  //   const customerId = stripeCustomerId();
  //   if (userId && email && customerId && props.projectId && refferalLink() === null) {
  //     getOrCreateReferralLink({ stripeCustomerId: stripeCustomerId(), projectId: props.projectId, email: userState().user?.email, userId: userId }).then((response) => {
  //       setState('logged_in_user_sees_thank_you');
  //       setRefferalLink(response);
  //     });
  //   } else if (userId && props.projectId) {
  //     checkLikeStatus({ projectId: props.projectId, userId: userId }).then((response) => {
  //       setState(response ? 'logged_in_user_sees_stripe_checkout' : 'logged_in_user_sees_like_button');
  //       setUserLiked(response);
  //     });
  //   }
  // });

  // createEffect(() => {
  //   if (localState() === 'initial' && !userState().user) {
  //     setState('not_logged_in_user_sees_like_button');
  //   }
  // });

  createEffect(() => {
    //* THIS IS FOR DEBUGGING
    //* MAKE SURE YOU COMMENT THIS OUT BEFORE COMMITING
    console.log('ProjectLikeButton MACHINE', {

    });
  });

  onMount(() => {

  });

  return (
    <div class="w-full flex px-4 gap-4 bg-brand_brackground">
      <Switch fallback={null}>
        <Match when={stripeCustomerId()}>
          <ThankYou
            refferalLinkId={extractCustomerId(stripeCustomerId() ?? "")}
            projectSlug={props.projectSlug}
            projectBannerSrc={props.projectBannerSrc}
          />
        </Match>
        <Match when={localState() === 'not_logged_in_user_sees_stripe_checkout' || localState() === 'logged_in_user_sees_stripe_checkout'}>
          <StripeCheckout
            projectId={props.projectId}
            projectSlug={props.projectSlug}
            sucessUrl={props.sucessUrl}
            projectBannerSrc={props.projectBannerSrc}
            projectCreatorName={props.projectCreatorName}
            referringUserId={props.referringUserId}
            onError={handleStripeCheckoutError}
          />
        </Match>
        <Match when={localState() === 'not_logged_in_user_sees_like_button' || localState() === 'logged_in_user_sees_like_button'}>
          <button onClick={() => {}} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2'>
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
      </Switch>
    </div>
  );
}

export default ProjectLikeButton;
