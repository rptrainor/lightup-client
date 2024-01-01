import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import { supabase } from '~/db/connection';
import { type User, type UserMetadata } from "~/types/schema";
import createReferralLink from "~/utilities/createReferralLink";
import createStripeCheckoutSession from "~/utilities/createStripeCheckoutSession";
import createUserLike from "~/utilities/createUserLike";
import getReferralLinkFromDB from "~/utilities/getReferralLinkFromDB";
// import getStripeSession from "~/utilities/getStripeSession";
// import getUserFromDB from "~/utilities/getUserFromDB";
import getUserLikeFromDB from "~/utilities/getUserLikeFromDB";
import signInOrCreateUser from "~/utilities/signInOrCreateUser";
import updateUserInDB from "~/utilities/updateUserinDB";

type UserLikes = {
  [key: string]: string | undefined;
};

type ReferralLinks = {
  [key: string]: string | undefined;
};

type ProjectLikeMachineContext = {
  user: User;
  user_metadata: UserMetadata;
  project_id: null | string;
  referring_id: null | string;
  user_likes: UserLikes;
  referral_links: ReferralLinks;
  stripe_client_secret: null | string;
  stripe_session_id: null | string;
  stripe_customer_id: null | string;
  project_donation_amount: number;
  project_donation_is_recurring: null | boolean;
  error_retry_count: number;
}

// Define initial context
const initialContext: ProjectLikeMachineContext = {
  user: {
    id: null,
    email: null,
    phone: null,
    created_at: null,
  },
  user_metadata: {
    city: null,
    state: null,
    country: null,
    full_name: null,
    avatar_url: null,
    deleted_at: null,
    updated_at: null,
    postal_code: null,
    address_line1: null,
    address_line2: null,
    stripe_customer_id: null,
  },
  project_id: null,
  referring_id: null,
  user_likes: {},
  referral_links: {},
  stripe_client_secret: null,
  stripe_session_id: null,
  stripe_customer_id: null,
  project_donation_amount: 0,
  project_donation_is_recurring: false,
  error_retry_count: 0,
};

type GuardType = () => boolean;
type TransitionFunctionType = () => void;

// State and context signals
const [state, setState] = createSignal<String>('Idle');
const [context, setContext] = createStore<ProjectLikeMachineContext>(initialContext);

// Function to update project_id and reset context
const updateProjectIdAndResetContext = (newProjectId: string) => {
  setContext('project_id', newProjectId);
  // Reset other parts of the context if needed
  setContext('stripe_client_secret', null);
  setContext('stripe_session_id', null);
  setContext('error_retry_count', 0);
  // Reset to the initial state
  setState('Idle');
};

// State transition functions
const transitionToIdle: TransitionFunctionType = () => setState('Idle');
const transitionToInitializingProjectLikeMachineContext: TransitionFunctionType = () => setState('InitializingProjectLikeMachineContext');
const transitionToLoggedInUserIsInContext: TransitionFunctionType = () => setState('LoggedInUserIsInContext');
const transitionToUserIsNotInContext: TransitionFunctionType = () => setState('UserIsNotInContext');
const transitionToNotLoggedInUserIsNotInContext: TransitionFunctionType = () => setState('NotLoggedInUserIsNotInContext');
const transitionToNotLoggedInUserHasReferralLinkInContext: TransitionFunctionType = () => setState('NotLoggedInUserHasReferralLinkInContext');
const transitionToNotLoggedInUserHasUserLikeInContext: TransitionFunctionType = () => setState('NotLoggedInUserHasUserLikeInContext');
const transitionToNotLoggedInUserHasStripeClientSecretInContext: TransitionFunctionType = () => setState('NotLoggedInUserHasStripeClientSecretInContext');
const transitionToNotLoggedInUserHasStripeSessionIdInContext: TransitionFunctionType = () => setState('NotLoggedInUserHasStripeSessionIdInContext');
const transitionToStripeSessionObjectIsInContext: TransitionFunctionType = () => setState('StripeSessionObjectIsInContext');
const transitionToError: TransitionFunctionType = () => setState('Error');
// Async actions
const getUserFromDB = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log('getUserFromDB error', error);
    //TODO: Handle error
  }
  const user = data.user;

  if (user && Object.keys(user).length > 0) {
    setContext('user', user);
    setContext('user_metadata', user.user_metadata);
    // setContext(c => ({ ...c, user: transformedUser }));
    transitionToLoggedInUserIsInContext();
  } else if (user === null) {
    setContext(c => ({ ...c, user: initialContext.user }));
    transitionToNotLoggedInUserIsNotInContext();
  }
}

const getStripeSession = async () => {
  const stripe_session_id = context.stripe_session_id;
  if (!stripe_session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${stripe_session_id}`);
  const stripe_session = await response.json();
  if (stripe_session.status === 'complete') {
    // const user_updated_with_stripe_customer_data = {
    //   ...context().user,
    //   email: stripe_session.customer_details.email,
    //   phone: stripe_session.customer_details.phone,
    //   user_metadata: {
    //     ...context().user.user_metadata,
    //     stripe_customer_id: stripe_session.customer,
    //     email: stripe_session.customer_details.email,
    //     name: stripe_session.customer_details.name,
    //     phone: stripe_session.customer_details.phone,
    //     city: stripe_session.customer_details.address.city,
    //     country: stripe_session.customer_details.address.country,
    //     address_line1: stripe_session.customer_details.address.line1,
    //     address_line2: stripe_session.customer_details.address.line2,
    //     postal_code: stripe_session.customer_details.address.postal_code,
    //     state: stripe_session.customer_details.address.state,
    //   }
    // };
    // setContext(c => ({
    //   ...c,
    //   user: user_updated_with_stripe_customer_data,
    //   stripe_customer_id,
    //   stripe_session_id,
    // }));
    setContext('stripe_customer_id', stripe_session.customer);
    setContext('stripe_session_id', stripe_session.id);
    setContext('user', {
      email: stripe_session.customer_details.email,
      phone: stripe_session.customer_details.phone
    });
    setContext('user_metadata', {
      stripe_customer_id: stripe_session.customer,
      full_name: stripe_session.customer_details.name,
      city: stripe_session.customer_details.address.city,
      country: stripe_session.customer_details.address.country,
      address_line1: stripe_session.customer_details.address.line1,
      address_line2: stripe_session.customer_details.address.line2,
      postal_code: stripe_session.customer_details.address.postal_code,
      state: stripe_session.customer_details.address.state,
    });
    transitionToStripeSessionObjectIsInContext();
  } else if (stripe_session.status === 'expired') {
    transitionToError();
  } else {
    return;
  }

};

const handleErrorState = () => {
  // Retry 3 times before giving up
  setContext(c => ({ ...c, error_retry_count: c.error_retry_count + 1 }));
  if (context.error_retry_count < 3) {
    setState('Idle');
  }
};

// Guard (should always return a boolean)
const isProjectIdInContext: GuardType = () => context.project_id !== null;
const isUserInContext: GuardType = () => context.user.id !== '';
const isReferralLinkInContext: GuardType = () => {
  const project_id = context.project_id;
  if (!project_id) {
    return false;
  }
  const referral_link = context.referral_links[project_id];
  if (!referral_link) {
    return false;
  }
  return true;
};
const isUserLikeInContext: GuardType = () => {
  const project_id = context.project_id;
  if (!project_id) {
    return false;
  }
  const user_like = context.user_likes[project_id];
  if (!user_like) {
    return false;
  }
  return true;
};
const isStripeClientSecretInContext: GuardType = () => context.stripe_client_secret !== null;
const isStripeSessionIdInContext: GuardType = () => context.stripe_session_id !== null;

// Watch for state changes
createEffect(() => {
  const currentState = state();

  switch (currentState) {
    case 'Idle':
      if (isProjectIdInContext()) {
        transitionToInitializingProjectLikeMachineContext();
      }
      break;
    case 'InitializingProjectLikeMachineContext':
      if (isUserInContext()) {
        transitionToLoggedInUserIsInContext();
      } else {
        transitionToUserIsNotInContext();
      }
      break;
    case 'UserIsNotInContext':
      getUserFromDB();
      break;
    case 'NotLoggedInUserIsNotInContext':
      if (isReferralLinkInContext()) {
        transitionToNotLoggedInUserHasReferralLinkInContext();
      } else if (isUserLikeInContext()) {
        transitionToNotLoggedInUserHasUserLikeInContext();
      }
      break;
    case 'NotLoggedInUserHasReferralLinkInContext':
      // RENDER REFERRAL LINK
      break;
    case 'NotLoggedInUserHasUserLikeInContext':
      // RENDER DONATION FORM
      if (isStripeClientSecretInContext()) {
        transitionToNotLoggedInUserHasStripeClientSecretInContext();
      }
      break;
    case 'NotLoggedInUserHasStripeClientSecretInContext':
      // RENDER STRIPE CHECKOUT FORM
      if (isStripeSessionIdInContext()) {
        transitionToNotLoggedInUserHasStripeSessionIdInContext();
      }
      break;
    case 'NotLoggedInUserHasStripeSessionIdInContext':
      // FETCH STRIPE SESSION OBJECT FROM STRIPE API VIA API ROUTE
      getStripeSession();
      break;
    case 'StripeSessionObjectIsInContext':

    case 'Error':
      handleErrorState();
      break;
    default:
      break;
  }
});

// Export state, context, and functions to be used in components
export { state, context, updateProjectIdAndResetContext };
