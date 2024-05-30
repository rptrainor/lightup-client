import { createEffect, Switch, Match, onMount, lazy } from "solid-js";

const StripeCheckout = lazy(() => import("~/components/StripeCheckout"));
const ThankYou = lazy(() => import("~/components/ThankYou"));

import { addNotification } from '~/stores/notificationStore';
import { state, updateProjectIdAndResetContext, transitionToError, handleUserLikeClick, handleStripeSessionIdSearchParamInURL } from '~/stores/projectLikeStore'

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

type Props = {
  projectId: string;
  projectSlug: string;
  sucessUrl: string;
  projectBannerSrc: string;
  projectCreatorName: string;
  referredByOtherUserId: string | undefined;
  session_id: string;
}

const ProjectLikeButton = (props: Props) => {
  const handleStripeCheckoutError = () => {
    transitionToError();
    addNotification({ type: 'error', header: 'Looks like something went wrong', subHeader: 'There was an error processing your payment. Please try again.' });
  };

  createEffect(() => {
    if (props.session_id) {
      handleStripeSessionIdSearchParamInURL()
    }
  });

  onMount(() => {
    updateProjectIdAndResetContext(props.projectId)
  });

  return (
    <div class="w-full flex px-4 gap-4 bg-brand_brackground">
      <Switch fallback={null}>
        <Match when={
          state() === 'LoggedInUserHasReferralLinkInContext' ||
          state() === 'NotLoggedInUserHasReferralLinkInContext' ||
          state() === 'LoggedInUserHasStripeSessionIdInContext' ||
          state() === 'NotLoggedInUserHasStripeSessionIdInContext'
        }>
          <ThankYou
            projectSlug={props.projectSlug}
            projectBannerSrc={props.projectBannerSrc}
          />
        </Match>
        <Match when={
          state() === 'LoggedInUserHasStripeClientSecretInContext' ||
          state() === 'LoggedInUserHasUserLikeInContext' ||
          state() === 'NotLoggedInUserHasStripeClientSecretInContext' ||
          state() === 'NotLoggedInUserHasUserLikeInContext'
        }>
          <StripeCheckout
            projectId={props.projectId}
            projectSlug={props.projectSlug}
            sucessUrl={props.sucessUrl}
            projectBannerSrc={props.projectBannerSrc}
            projectCreatorName={props.projectCreatorName}
            referredByOtherUserId={props.referredByOtherUserId}
            onError={handleStripeCheckoutError}
          />
        </Match>
        <Match when={
          state() === 'LoggedInUserHasNotLiked' ||
          state() === 'NotLoggedInUserHasNotLiked'
        }>
          <button onClick={handleUserLikeClick} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 group'>
            <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
              <span>Like</span>
              <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
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
