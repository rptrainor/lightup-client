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
import { handleSignInWithEmailAuth } from '~/utilities/handleSignInWithEmailAuth';
import signInOrCreateUser from "~/utilities/signInOrCreateUser";
import updateUserInDB from "~/utilities/updateUserinDB";

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
const transitionToError: TransitionFunctionType = () => setState('Error');

// Async actions
const handleUpdateUserLikesInDB = async () => {
  // Extract current user_likes from context
  const currentUserLikes = context.user_likes;
  const userId = context.user.id;

  if (!userId) {
    console.error('User ID is not set in context');
    transitionToError();
    return;
  }

  // Prepare data for batch insert
  const userLikesData = Object.entries(currentUserLikes).map(([projectId, liked]) => ({
    user_id: userId,
    project_id: projectId,
    liked_at: liked ? new Date().toISOString() : null
  }));

  // Insert data into Supabase
  const { data, error } = await supabase
    .from('user_likes')
    .insert(userLikesData)
    .select();

  if (error) {
    console.error('Error updating user likes in DB:', error);
    transitionToError();
    return;
  }

  console.log('User likes updated in DB:', data);
};

const handleUpdateReferralLinksInDB = async () => {
  // Extract current referral_links from context
  const currentReferralLinks = context.referral_links;
  const userId = context.user.id;

  if (!userId) {
    console.error('User ID is not set in context');
    transitionToError();
    return;
  }

  // Prepare data for batch insert
  const referralLinksData = Object.entries(currentReferralLinks).map(([projectId, stripeCustomerId]) => ({
    user_id: userId,
    project_id: projectId,
    stripe_customer_id: stripeCustomerId,
    // Add other necessary fields here
  }));

  // Insert data into Supabase
  const { data, error } = await supabase
    .from('referral_links')
    .insert(referralLinksData)
    .select();

  if (error) {
    console.error('Error updating referral links in DB:', error);
    transitionToError();
    return;
  }

  console.log('Referral links updated in DB:', data);
};

const handleUpdateUserInDB = async () => {
  const user = context.user;
  const user_metadata = context.user_metadata;
  if (!user.email) {
    console.error('User email is not set in context');
    transitionToError();
    return;
  }
  const { error } = await supabase.auth.updateUser({
    email: user.email,
    phone: user.phone ?? undefined,
    data: { ...user_metadata, updated_at: new Date().toISOString() }
  })
  if (error) {
    console.error('handleUpdateUserInDB error', error);
    transitionToError();
  };
  return;
};

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
    handleUpdateUserLikesInDB();
    handleUpdateReferralLinksInDB();
    handleUpdateUserInDB();
    transitionToLoggedInUserIsInContext();
  } else if (user === null) {
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

const createRefferalLinkInDB = async () => {
  if (!context.stripe_customer_id) {
    console.error('Stripe customer ID is not set in context');
    transitionToError();
    return;
  }
  const referring_id = formatRefferringIdFromStripeCustomerId(context.stripe_customer_id);
  const { data, error } = await supabase
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
    .select()

  if (error) {
    console.error('Error creating referral link in DB:', error);
    transitionToError();
    return;
  }
  updateReferralLink(context.stripe_customer_id);
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
    updateReferralLink(stripe_session.customer);
    handleUpdateUserLikesInDB();
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
    updateReferralLink(stripe_session.customer);
    handleAuthWithEmail(stripe_session.customer_details.email);
  } else if (stripe_session.status === 'expired') {
    transitionToError();
  } else {
    return;
  }
};

const updateReferralLink = (stripe_customer_id: string) => {
  const project_id = context.project_id;
  const referring_id = formatRefferringIdFromStripeCustomerId(stripe_customer_id);
  if (project_id) {
    setContext('referral_links', project_id, referring_id);
  } else {
    console.error('Project ID is not set in context');
  }
};

const addUserLike = () => {
  const project_id = context.project_id;
  if (project_id) {
    setContext('user_likes', project_id, true);
  } else {
    console.error('Project ID is not provided');
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
      getStripeSessionThenAuth();
      break;
    case 'LoggedInUserIsInContext':
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
    case 'LoggedInUserHasNotLiked':
      // RENDER LIKE BUTTON
      if (isUserLikeInContext()) {
        transitionToLoggedInUserHasUserLikeInContext();
      }
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
  addUserLike
};
