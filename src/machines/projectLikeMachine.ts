import { createMachine } from "xstate";
import { type User } from "~/types/schema";
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
            guard: "isProjectInContext",
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
            guard: "isReferralLinkInContext",
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
          src: (context, event) => getReferralLinkFromDB(context),
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
      LoggedInUserDoesNotHaveReferralLinkInDB: {},
      LoggedInUserHasReferralLink: {
        type: "final",
      },
      UserIsNotInContext: {},
    },
  },
  {
    actions: {},
    actors: {},
    guards: {
      isUserInContext: ({ context }) => {
        if (context.user.id !== "") {
          return true;
        }
        return false;
      },
      isReferralLinkInContext: ({ context, event }) => {
        if (context.referral_links[event.project_id] !== undefined) {
          return true;
        }
        return false;
      },
    },
    delays: {},
  },
);