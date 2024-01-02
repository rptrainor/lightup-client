import { createSignal, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import { supabase } from '~/db/connection';
import { type User, type UserMetadata } from "~/types/schema";

export type ProjectLikeMachineStatesType =
  'Idle' |
  'InitializingProjectLikeMachineContext' |
  'LoggedInUserIsInContext' |
  'UserIsNotInContext' |
  'NotLoggedInUserIsNotInContext' |
  'NotLoggedInUserHasReferralLinkInContext' |
  'NotLoggedInUserHasUserLikeInContext' |
  'NotLoggedInUserHasNotLiked' |
  'NotLoggedInUserHasStripeClientSecretInContext' |
  'NotLoggedInUserHasStripeSessionIdInContext' |
  'NotLoggedInUserHasStripeSessionObjectInContext' |
  'LoggedInUserHasReferralLinkInContext' |
  'LoggedInUserHasUserLikeInContext' |
  'LoggedInUserHasNotLiked' |
  'LoggedInUserHasStripeClientSecretInContext' |
  'LoggedInUserHasStripeSessionIdInContext' |
  'Error';

type UserLikes = {
  [key: string]: boolean | undefined;
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
const [state, setState] = createSignal<ProjectLikeMachineStatesType>('Idle');
const [context, setContext] = createStore<ProjectLikeMachineContext>(initialContext);

// Function to update project_id and reset context
const updateProjectIdAndResetContext = (newProjectId: string) => {
  setContext('project_id', newProjectId);
  // Reset other parts of the context if needed
  setContext('stripe_client_secret', null);
  setContext('stripe_session_id', null);
  setContext('error_retry_count', 0);
  // Reset to the initial state
  transitionToIdle();
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
const transitionToLoggedInUserHasReferralLinkInContext: TransitionFunctionType = () => setState('LoggedInUserHasReferralLinkInContext');
const transitionToLoggedInUserHasUserLikeInContext: TransitionFunctionType = () => setState('LoggedInUserHasUserLikeInContext');
const transitionToLoggedInUserHasStripeClientSecretInContext: TransitionFunctionType = () => setState('LoggedInUserHasStripeClientSecretInContext');
const transitionToLoggedInUserHasStripeSessionIdInContext: TransitionFunctionType = () => setState('LoggedInUserHasStripeSessionIdInContext');
const transitionToLoggedInUserHasNotLiked: TransitionFunctionType = () => setState('LoggedInUserHasNotLiked');
const transitionToNotLoggedInUserHasNotLiked: TransitionFunctionType = () => setState('NotLoggedInUserHasNotLiked');
const transitionToError: TransitionFunctionType = () => setState('Error');

// Async actions
const getUserFromDB = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('getUserFromDB error', error);
    return;
  }

  const user = data.user;
  if (user && Object.keys(user).length > 0) {
    setContext('user', user);
    setContext('user_metadata', user.user_metadata);

    const userLikesPromise = supabase
      .from('user_likes')
      .select('*')
      .eq('user_id', user.id);

    const referralLinksPromise = supabase
      .from('referral_links')
      .select('*')
      .eq('user_id', user.id);

    const results = await Promise.allSettled([userLikesPromise, referralLinksPromise]);

    const userLikesResult = results[0];
    const referralLinksResult = results[1];

    if (userLikesResult.status === 'fulfilled' && userLikesResult.value.data) {
      const userLikes = userLikesResult.value.data.reduce((acc, item) => {
        acc[item.project_id] = item.is_liked;
        return acc;
      }, {});
      setContext('user_likes', userLikes);
    } else {
      console.error('Error fetching user likes:', userLikesResult);
    }

    if (referralLinksResult.status === 'fulfilled' && referralLinksResult.value.data) {
      const referralLinks = referralLinksResult.value.data.reduce((acc, item) => {
        acc[item.project_id] = item.referring_id;
        return acc;
      }, {});
      setContext('referral_links', referralLinks);
    } else {
      console.error('Error fetching referral links:', referralLinksResult);
    }

    transitionToLoggedInUserIsInContext();
  } else {
    transitionToNotLoggedInUserIsNotInContext();
  }
}

const handleAuthWithEmail = async (email: string) => {
  let { error } = await supabase.auth.signInWithOtp({
    email
  })
  if (error) {
    console.error('handleAuthWithEmail error', error);
    transitionToError();
  };
  return;
}

const formatRefferringIdFromStripeCustomerId = (stripe_customer_id: string) => {
  // Assuming all customer IDs start with 'cus_' and are at least as long as the prefix
  if (stripe_customer_id.startsWith('cus_')) {
    return stripe_customer_id.substring(4); // 'cus_' is 4 characters long
  }

  // Handle the case where the string does not start with 'cus_'
  console.warn('Invalid Stripe customer ID:', stripe_customer_id);
  return stripe_customer_id;
};

const createUserLikeInDB = async () => {
  const project_id = context.project_id;
  if (!project_id) {
    console.error('Project ID is not provided');
    transitionToError();
    return;
  }
  const { error } = await supabase
    .from('user_likes')
    .insert([
      {
        user_id: context.user.id,
        project_id: project_id,
        is_liked: true,
      },
    ])

  if (error) {
    console.error('Error creating user like in DB:', error);
    transitionToError();
    return;
  }
  updateUserLikeInContext();
  return;
};

const createRefferalLinkInDB = async () => {
  if (!context.stripe_customer_id) {
    console.error('Stripe customer ID is not set in context');
    transitionToError();
    return;
  }
  const referring_id = formatRefferringIdFromStripeCustomerId(context.stripe_customer_id);
  const { error } = await supabase
    .from('referral_links')
    .insert([
      {
        user_id: context.user.id,
        project_id: context.project_id,
        stripe_customer_id: context.stripe_customer_id,
        email: context.user.email,
        referring_id: referring_id,
      },
    ])

  if (error) {
    console.error('Error creating referral link in DB:', error);
    transitionToError();
    return;
  }
  updateReferralLinkInContext({ referring_id, stripe_customer_id: context.stripe_customer_id });
  return;
};

const getStripeSession = async () => {
  const stripe_session_id = context.stripe_session_id;
  if (!stripe_session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${stripe_session_id}`);
  const stripe_session = await response.json();
  if (stripe_session.status === 'complete') {
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
    updateReferralLinkInContext({ stripe_customer_id: stripe_session.customer, referring_id: undefined });

    // handleUpdateUserLikesInDB();
  } else if (stripe_session.status === 'expired') {
    transitionToError();
  } else {
    return;
  }
};

const getStripeSessionThenAuth = async () => {
  const stripe_session_id = context.stripe_session_id;
  if (!stripe_session_id) {
    return;
  }
  const response = await fetch(`/api/session-status?session_id=${stripe_session_id}`);
  const stripe_session = await response.json();
  if (stripe_session.status === 'complete') {
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
    updateReferralLinkInContext({ stripe_customer_id: stripe_session.customer, referring_id: undefined });
    createRefferalLinkInDB();
    handleAuthWithEmail(stripe_session.customer_details.email);
  } else if (stripe_session.status === 'expired') {
    transitionToError();
  } else {
    return;
  }
};

const handleUserLikeClick = () => {
  const project_id = context.project_id;
  if (!project_id) {
    console.error('Project ID is not provided');
    transitionToError();
    return;
  }
  setContext('user_likes', project_id, true);
  if (context.user.id) {
    createUserLikeInDB();
  } else {
    transitionToNotLoggedInUserHasUserLikeInContext();
  }
};

const handleUserProjectDonationAmountChange = (amount: number) => {
  setContext('project_donation_amount', amount);
};

const handleUserProjectDonationIsRecurringChange = (is_recurring: boolean) => {
  setContext('project_donation_is_recurring', is_recurring);
};

type UpdateReferralLinkInContextProps = {
  stripe_customer_id: string | undefined;
  referring_id: string | undefined;
}

const updateReferralLinkInContext = (props: UpdateReferralLinkInContextProps) => {
  const project_id = context.project_id;
  let referring_id = '';
  if (!project_id) {
    console.error('Project ID is not provided');
    transitionToError();
    return;
  }
  if (props.referring_id) {
    referring_id = props.referring_id;
  }
  if (props.stripe_customer_id) {
    referring_id = formatRefferringIdFromStripeCustomerId(props.stripe_customer_id);
  }
  setContext('referring_id', referring_id);
  setContext('referral_links', project_id, referring_id);
  return;
};

const updateUserLikeInContext = () => {
  const project_id = context.project_id;
  if (!project_id) {
    console.error('Project ID is not provided');
    transitionToError();
    return;
  }
  setContext('user_likes', project_id, true);
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
const isUserInContext: GuardType = () => context.user.id !== null;

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
      // MACHINE HAS NOT RESET YET
      if (isProjectIdInContext()) {
        transitionToInitializingProjectLikeMachineContext();
      }
      break;
    case 'InitializingProjectLikeMachineContext':
      // MACHINE HAS RESET WITH NEW PROJECT ID
      if (isUserInContext()) {
        // USER IS LOGGED IN AND IN THE CONTEXT
        // NEXT THING TO DO IS SYNC USER, USER METADATA, USER LIKES, AND REFERRAL LINKS FROM DB
        transitionToLoggedInUserIsInContext();
      } else {
        // USER IS NOT IN CONTEXT
        // NEXT THING TO DO IS CHECK IF USER IS LOGGED IN
        transitionToUserIsNotInContext();
      }
      break;
    case 'UserIsNotInContext':
      getUserFromDB();
      break;
    case 'NotLoggedInUserIsNotInContext':
      // USER IS NOT LOGGED IN AND NOT IN CONTEXT
      // NEXT THE BELOW GUARDS WILL BE CHECKED IN ORDER
      // TO DETERMINE WHAT TO DO NEXT BASED ON THE LOCAL CONTEXT
      if (isReferralLinkInContext()) {
        transitionToNotLoggedInUserHasReferralLinkInContext();
      } else if (isUserLikeInContext()) {
        transitionToNotLoggedInUserHasUserLikeInContext();
      } else {
        transitionToNotLoggedInUserHasNotLiked();
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
    case 'NotLoggedInUserHasNotLiked':
      // RENDER LIKE BUTTON
      if (isUserLikeInContext()) {
        transitionToNotLoggedInUserHasUserLikeInContext();
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
      getStripeSessionThenAuth();
      break;
    case 'LoggedInUserIsInContext':
      // USER IS LOGGED IN, WITH USER, USER META DATA, USE LIKES, AND REFERRAL LINKS IN CONTEXT
      // NEXT THE BELOW GUARDS WILL BE CHECKED IN ORDER
      // TO DETERMINE WHAT TO DO NEXT BASED ON THE LOCAL CONTEXT
      if (isReferralLinkInContext()) {
        transitionToLoggedInUserHasReferralLinkInContext();
      } else if (isUserLikeInContext()) {
        transitionToLoggedInUserHasUserLikeInContext();
      } else {
        transitionToLoggedInUserHasNotLiked();
      };
      break;
    case 'LoggedInUserHasReferralLinkInContext':
      // RENDER REFERRAL LINK
      break;
    case 'LoggedInUserHasUserLikeInContext':
      // RENDER DONATION FORM
      if (isStripeClientSecretInContext()) {
        transitionToLoggedInUserHasStripeClientSecretInContext();
      }
      break;
    case 'LoggedInUserHasNotLiked':
      // RENDER LIKE BUTTON
      if (isUserLikeInContext()) {
        transitionToLoggedInUserHasUserLikeInContext();
      }
      break;
    case 'LoggedInUserHasStripeClientSecretInContext':
      // RENDER STRIPE CHECKOUT FORM
      if (isStripeSessionIdInContext()) {
        transitionToLoggedInUserHasStripeSessionIdInContext();
      }
      break;
    case 'LoggedInUserHasStripeSessionIdInContext':
      // FETCH STRIPE SESSION OBJECT FROM STRIPE API VIA API ROUTE
      getStripeSession();
      break;
    case 'Error':
      handleErrorState();
      break;
    default:
      break;
  }
});

// Export state, context, and functions to be used in components
export {
  state,
  context,
  updateProjectIdAndResetContext,
  handleUserLikeClick,
  handleUserProjectDonationAmountChange,
  handleUserProjectDonationIsRecurringChange,
  transitionToError,
};
