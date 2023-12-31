import { assign, createMachine } from "xstate";
import { type User } from "~/types/schema";
import createUserLike from "~/utilities/createUserLike";
import getReferralLinkFromDB from "~/utilities/getReferralLinkFromDB";
import getUserLikeFromDB from "~/utilities/getUserLikeFromDB";
type UserLikes = {
  [key: string]: string | undefined;
};

type ReferralLinks = {
  [key: string]: string | undefined;
};

interface ProjectLikeMachineContext {
  user: User;
  project_id: string;
  user_likes: UserLikes;
  referral_links: ReferralLinks;
  stripe_client_secret: string;
  project_donation_amount: string;
  project_donation_is_recurring: boolean;
}

export const machine = createMachine(
  {
    context: {
      user: {
        id: "",
        email: "",
        phone: "",
        created_at: "",
        user_metadata: {
          city: "",
          state: "",
          country: "",
          full_name: "",
          avatar_url: "",
          deleted_at: "",
          updated_at: "",
          postal_code: "",
          address_line1: "",
          address_line2: "",
          stripe_customer_id: "",
        },
      } as User,
      project_id: "",
      user_likes: {} as UserLikes,
      referral_links: {} as ReferralLinks,
      stripe_client_secret: "",
      project_donation_amount: "",
      project_donation_is_recurring: false,
    } as ProjectLikeMachineContext,
    id: "projectLike",
    initial: "Idle",
    states: {
      Idle: {
        always: [
          {
            cond: "isUserInContext",
            target: "LoggedInUserIsInContext",
          },
          {
            target: "UserIsNotInContext",
          }
        ],
      },
      LoggedInUserIsInContext: {
        always: [
          {
            cond: "isReferralLinkInContext",
            target: "LoggedInUserHasReferralLink",
          },
          {
            target: "LoggedInUserDoesNotHaveReferralLinkInContext"
          }
        ]
      },
      LoggedInUserDoesNotHaveReferralLinkInContext: {
        invoke: {
          id: "getReferralLink",
          src: (context) => getReferralLinkFromDB({
            stripe_customer_id: context.user.user_metadata.stripe_customer_id,
            project_id: context.project_id,
          }),
          onDone: {
            target: "LoggedInUserHasReferralLink",
            actions: assign({
              referral_links: (context, event) => ({
                ...context.referral_links,
                [context.project_id]: event.data,
              }),
            }),
          },
          onError: "LoggedInUserDoesNotHaveReferralLinkInDB"
        },
      },
      LoggedInUserDoesNotHaveReferralLinkInDB: {
        always: [
          {
            cond: "IsUserLikeInContext",
            target: "LoggedInUserHasUserLikeInContext",
          },
          {
            target: "LoggedInUserDoesNotHaveUserLikeInContext",
          }
        ]
      },
      LoggedInUserHasUserLikeInContext: {},
      LoggedInUserDoesNotHaveUserLikeInContext: {
        invoke: {
          id: "getUserLike",
          src: (context) => getUserLikeFromDB({
            user_id: context.user.id,
            project_id: context.project_id,
          }),
          onDone: {
            target: "LoggedInUserHasUserLikeInContext",
            actions: assign({
              user_likes: (context, event) => ({
                ...context.user_likes,
                [context.project_id]: event.data,
              }),
            }),
          },
          onError: "LoggedInUserHasNotLiked"
        },
      },
      LoggedInUserHasNotLiked: {
        on: {
          USER_CLICKED_LIKE: {
            target: "LoggedInUserHasClickedLike",
          },
        }
      },
      LoggedInUserHasClickedLike: {
        invoke: {
          id: "createUserLike",
          src: (context) => createUserLike({
            user_id: context.user.id,
            project_id: context.project_id,
          }),
          onDone: {
            target: "LoggedInUserHasUserLikeInContext",
            actions: assign({
              user_likes: (context, event) => ({
                ...context.user_likes,
                [context.project_id]: event.data,
              }),
            }),
          },
          onError: "LoggedInUserHasNotLiked"
        },
      },
      LoggedInUserHasReferralLink: {
        type: "final",
      },
      UserIsNotInContext: {},
    },
  },
  {
    actions: {},
    guards: {
      isUserInContext: (context) => {
        if (context.user.id !== "") {
          return true;
        }
        return false;
      },
      isReferralLinkInContext: (context, event) => {
        if (context.referral_links[event.project_id] !== undefined) {
          return true;
        }
        return false;
      },
    },
    delays: {},
  },
);