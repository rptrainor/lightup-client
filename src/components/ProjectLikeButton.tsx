import { createSignal, createEffect, Switch, Match, createResource } from "solid-js";

import StripeCheckout from "~/components/StripeCheckout";
import ThankYou from "~/components/ThankYou";
import { addNotification } from '~/stores/notificationStore';
import { handleUserUpdate } from "~/utilities/handleUserUpdate";
import { userState } from "~/stores/authStore";
import { getOrCreateReferralLink } from "~/utilities/getOrCreateReferralLink";
import { handleSignInWithEmailAuth } from "~/utilities/handleSignInWithEmailAuth";
import checkLikeStatus from "~/utilities/checkLikeStatus";
import likeProject from "~/utilities/likeProject";

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

type LikeButtonState = "initial" | "render_button" | "render_info" | "render_payment" | 'render_checkout' | 'render_signin_message' | "render_share_buttons";

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
  const [customerEmail, setCustomerEmail] = createSignal('');
  const [payload, setPayload] = createSignal(props);
  const [response] = createResource(payload, getStripeSession);
  const [refferalLinkId, setRefferalLinkId] = createSignal('');

  const handleStripeCheckoutError = () => {
    setState("render_payment")
    addNotification({ type: 'error', header: 'Something went wrong', subHeader: 'Please try again' })
  }

  const handleLikeProject = () => {
    setState("render_payment")
    addNotification({ type: 'success', header: 'Amplify your impact with a dontation', subHeader: 'Remember, your 20% sustainability contribution can be made back 100% when just two of your friends give with your referral link of equal or greater amounts' })
    const userId = userState().user?.id;
    if (!userId) {
      return;
    }
    likeProject({ userId: userId, projectId: props.projectId });
  };

  createEffect(async () => {
    const userId = userState().user?.id;
    const projectId = props.projectId;

    console.log('createEffect - userId', { userId })
    console.log('createEffect - props', { props })

    if (typeof userId === 'string' && projectId) {
      try {
        const referralLink = await getOrCreateReferralLink({ projectId, userId });
        if (referralLink && referralLink.id) {
          setRefferalLinkId(referralLink.id);
        } else {
          console.error('Error getting or creating referral link:', referralLink);
        }
      } catch (error) {
        console.error('Error getting or creating referral link:', error);
      }
    }
  });

  createEffect(() => {
    if (props.session_id) {
      setPayload(props);
    }
  });

  createEffect(async () => {
    if (response()) {
      console.log('======> response <=======', response());
      if (response().status === 'open') {
        handleStripeCheckoutError();
      } else if (response().status === 'complete') {

        setState("render_share_buttons")
        setCustomerEmail((response().customer_details.email));

        addNotification({
          type: 'success',
          header: 'Thank you for Being A Light with your Donation',
          subHeader: 'You earn 10% back from the Sustainability Contributions for each donation made through your link. A simple, powerful way to support more research.'
        })
        if (userState().user?.id) {
          try {
            await handleUserUpdate(response());
            // ... Rest of your success logic
          } catch (error) {
            console.error('Error handling user update:', error);
            // Handle error
          }
        } else {
          setState("render_signin_message")
          handleSignInWithEmailAuth(response().customer_details.email)
        }
      }
    }
  });

  createEffect(async () => {
    const userId = userState().user?.id;
    if (userId) {
      const status = await checkLikeStatus({ userId: userId, projectId: props.projectId });
      setState(status ? "render_payment" : "render_button")
    } else {
      setState("render_button")
    }
  });

  createEffect(() => {
    console.log('state: ', state())
    console.log('props:', { props })
    console.log('userState', { userState: userState() })
  });

  return (
    <Switch fallback={null}>
      <Match when={state() === 'render_payment'}>
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
      <Match when={state() === 'render_button'}>
        <button onClick={handleLikeProject} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 sticky top-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch >
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
        <ThankYou
          refferalLinkId={refferalLinkId()}
          projectSlug={props.projectSlug}
          projectBannerSrc={props.projectBannerSrc}
        />
      </Match>
      <Match when={state() === 'render_signin_message'}>
        <div class="flex flex-col">
          <h1>Before we can share your referral link, you need to sign in to Lightup</h1>
          <h2>An email has been sent to {customerEmail()}, if you click on the link in that email, you will be redirected back here to the Lightup app and you can start sharing your unique referral link</h2>
        </div>
      </Match>
    </Switch>
  );
}

export default ProjectLikeButton;