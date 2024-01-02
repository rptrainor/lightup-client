// import { assign, createMachine } from "xstate";
// import { type User } from "~/types/schema";
// import createReferralLink from "~/utilities/createReferralLink";
// import createStripeCheckoutSession from "~/utilities/createStripeCheckoutSession";
// import createUserLike from "~/utilities/createUserLike";
// import getReferralLinkFromDB from "~/utilities/getReferralLinkFromDB";
// import getStripeSession from "~/utilities/getStripeSession";
// import getUserFromDB from "~/utilities/getUserFromDB";
// import getUserLikeFromDB from "~/utilities/getUserLikeFromDB";
// import signInOrCreateUser from "~/utilities/signInOrCreateUser";
// import updateUserInDB from "~/utilities/updateUserinDB";

// type UserLikes = {
//   [key: string]: string | undefined;
// };

// type ReferralLinks = {
//   [key: string]: string | undefined;
// };

// interface ProjectLikeMachineContext {
//   user: User;
//   project_id: string;
//   referring_id: string;
//   user_likes: UserLikes;
//   referral_links: ReferralLinks;
//   stripe_client_secret: string;
//   stripe_session_id: string;
//   stripe_customer_id: string;
//   project_donation_amount: number;
//   project_donation_is_recurring: boolean;
// }

// type INITIALIZE_PROJECT_LIKE_MACHINE_CONTEXT = {
//   type: 'INITIALIZE_PROJECT_LIKE_MACHINE_CONTEXT';
//   data: string;
// };

// type UserClickedDonate = {
//   type: 'USER_CLICKED_DONATE';
//   data: string;
// };

// type UserClickedLikeEvent = {
//   type: 'USER_CLICKED_LIKE';
//   data: string;
// };

// type NotLoggedInUserHasClickedLikeEvent = {
//   type: 'NOT_LOGGED_IN_USER_CLICKED_LIKE';
//   data: string;
// };

// interface UserUpdatesDonationAmountEvent {
//   type: 'USER_UPDATES_PROJECT_DONATION_AMOUNT';
//   data: number;
// }

// interface UserUpdatesIsRecurringEvent {
//   type: 'USER_UPDATES_IS_RECURRING';
//   data: boolean;
// }

// interface SessionIdReceived {
//   type: 'SESSION_ID_RECEIVED';
//   data: string;
// }

// const projectLikeMachine = createMachine<ProjectLikeMachineContext,
//   UserUpdatesDonationAmountEvent |
//   UserClickedLikeEvent |
//   UserUpdatesIsRecurringEvent |
//   UserClickedDonate |
//   SessionIdReceived |
//   NotLoggedInUserHasClickedLikeEvent |
//   INITIALIZE_PROJECT_LIKE_MACHINE_CONTEXT
// >(
//   {
//     context: {
//       user: {
//         id: "",
//         email: "",
//         phone: "",
//         created_at: "",
//         user_metadata: {
//           city: "",
//           state: "",
//           country: "",
//           full_name: "",
//           avatar_url: "",
//           deleted_at: "",
//           updated_at: "",
//           postal_code: "",
//           address_line1: "",
//           address_line2: "",
//           stripe_customer_id: "",
//         },
//       } as User,
//       project_id: "",
//       user_likes: {},
//       referral_links: {},
//       stripe_client_secret: "",
//       stripe_session_id: "",
//       stripe_customer_id: "",
//       project_donation_amount: 0,
//       project_donation_is_recurring: false,
//     } as ProjectLikeMachineContext,
//     id: "projectLikeMachine",
//     initial: "Idle",
//     states: {
//       Idle: {
//         on: {
//           INITIALIZE_PROJECT_LIKE_MACHINE_CONTEXT: {
//             target: 'InitializingProjectLikeMachineContext',
//             actions: assign((_, event) => ({
//               project_id: event.data,
//             })),
//           }
//         }
//       },
//       InitializingProjectLikeMachineContext: {
//         always: [
//           {
//             cond: "isUserInContext",
//             target: "LoggedInUserIsInContext",
//           },
//           {
//             target: "UserIsNotInContext",
//           }
//         ],
//       },
//       LoggedInUserIsInContext: {
//         always: [
//           {
//             cond: "isReferralLinkInContext",
//             target: "LoggedInUserHasReferralLink",
//           },
//           {
//             target: "LoggedInUserDoesNotHaveReferralLinkInContext"
//           }
//         ]
//       },
//       LoggedInUserDoesNotHaveReferralLinkInContext: {
//         // invoke: {
//         //   id: "getReferralLink",
//         //   src: (context) => getReferralLinkFromDB({
//         //     stripe_customer_id: context.user.user_metadata.stripe_customer_id,
//         //     project_id: context.project_id
//         //   }),
//         //   onDone: {
//         //     target: "LoggedInUserHasReferralLink",
//         //     actions: assign({
//         //       referral_links: (context, event) => ({
//         //           ...context.referral_links,
//         //           [context.project_id]: event.data,
//         //         }),
//         //     }),
//         //   },
//         //   onError: {
//         //     target: "LoggedInUserDoesNotHaveReferralLinkInDB"
//         //   }
//         // },
//       },
//       LoggedInUserDoesNotHaveReferralLinkInDB: {
//         always: [
//           {
//             cond: "IsUserLikeInContext",
//             target: "LoggedInUserHasUserLikeInContext",
//           },
//           {
//             target: "LoggedInUserDoesNotHaveUserLikeInContext",
//           }
//         ]
//       },
//       LoggedInUserHasUserLikeInContext: {
//         on: {
//           USER_UPDATES_PROJECT_DONATION_AMOUNT: {
//             actions: assign({
//               project_donation_amount: (_, event) => event.data
//             }),
//           },
//           USER_UPDATES_IS_RECURRING: {
//             actions: assign({
//               project_donation_is_recurring: (_, event) => event.data,
//             }),
//           },
//           USER_CLICKED_DONATE: {
//             target: "LoggedInUserHasClickedDonate",
//           },
//         }
//       },
//       LoggedInUserHasClickedDonate: {
//         invoke: {
//           id: "createStripeCheckoutSession",
//           src: (context) => createStripeCheckoutSession({
//             project_id: context.project_id,
//             referring_id: context.referring_id,
//             project_donation_amount: context.project_donation_amount,
//             project_donation_is_recurring: context.project_donation_is_recurring,
//             sucess_url: window.location.href,
//           }),
//           onDone: {
//             target: "LoggedInUserHasStripeClientSecretInContext",
//             actions: assign({
//               stripe_client_secret: (_, event) => event.data,
//             }),
//           },
//           onError: "LoggedInUserDoesNotHaveStripeClientSecretInContext"
//         },
//       },
//       LoggedInUserHasStripeClientSecretInContext: {
//         on: {
//           SESSION_ID_RECEIVED: {
//             target: 'LoggedInUserHasSessionId',
//             actions: assign({
//               stripe_session_id: (_, event) => {
//                 // console.log('LoggedInUserHasStripeClientSecretInContext - stripe_session_id', { event })
//                 return event.data
//               },
//             })
//           },
//         }
//       },
//       // LoggedInUserHasSessionId: {
//       //   invoke: {
//       //     id: "getStripeSession",
//       //     src: (context) => getStripeSession(context.stripe_session_id),
//       //     onDone: {
//       //       target: "LoggedInUserHasStripeSessionObject",
//       //       actions: assign({
//       //         stripe_session_id: (_, event) => {
//       //           // console.log('LoggedInUserHasSessionId - stripe_session_id', { event })
//       //           return event.data
//       //         },
//       //         user: (context, event) => {
//       //           // console.log('LoggedInUserHasSessionId - user', { context, event })
//       //           return ({
//       //             ...context.user,
//       //             email: event.data.customer_details.email,
//       //             user_metadata: {
//       //               ...context.user.user_metadata,
//       //               stripe_customer_id: event.data.customer,
//       //               email: event.data.customer_details.email,
//       //               name: event.data.customer_details.name,
//       //               phone: event.data.customer_details.phone,
//       //               city: event.data.customer_details.address.city,
//       //               country: event.data.customer_details.address.country,
//       //               address_line1: event.data.customer_details.address.line1,
//       //               address_line2: event.data.customer_details.address.line2,
//       //               postal_code: event.data.customer_details.address.postal_code,
//       //               state: event.data.customer_details.address.state,
//       //             },
//       //           })
//       //         },
//       //       }),
//       //     },
//       //     onError: "LoggedInUserDoesNotHaveStripeSession"
//       //   },
//       // },
//       LoggedInUserHasStripeSessionObject: {
//         // invoke: {
//         //   id: 'createReferralLink',
//         //   src: (context) => createReferralLink({
//         //     user_id: context.user.id,
//         //     project_id: context.project_id,
//         //     referring_id: context.referring_id,
//         //     email: context.user.email,
//         //     stripe_customer_id: context.user.user_metadata.stripe_customer_id,
//         //   }),
//         //   onDone: {
//         //     target: "LoggedInUserHasReferralLink",
//         //     actions: assign({
//         //       referral_links: (context, event) => {
//         //         // console.log('LoggedInUserHasStripeSessionObject - referral_links', { context, event })
//         //         return ({
//         //           ...context.referral_links,
//         //           [context.project_id]: event.data,
//         //         })
//         //       },
//         //     }),
//         //   }
//         // }
//       },
//       LoggedInUserDoesNotHaveStripeSession: {},
//       LoggedInUserDoesNotHaveStripeClientSecretInContext: {},
//       LoggedInUserDoesNotHaveUserLikeInContext: {
//         // invoke: {
//         //   id: "getUserLike",
//         //   src: (context) => getUserLikeFromDB({
//         //     user_id: context.user.id,
//         //     project_id: context.project_id,
//         //   }),
//         //   onDone: {
//         //     target: "LoggedInUserHasUserLikeInContext",
//         //     actions: assign({
//         //       user_likes: (context, event) => {
//         //         // console.log('LoggedInUserDoesNotHaveUserLikeInContext - user_likes', { context, event })
//         //         return ({
//         //           ...context.user_likes,
//         //           [context.project_id]: event.data,
//         //         })
//         //       },
//         //     }),
//         //   },
//         //   onError: "LoggedInUserHasNotLiked"
//         // },
//       },
//       LoggedInUserHasNotLiked: {
//         on: {
//           USER_CLICKED_LIKE: {
//             target: "LoggedInUserHasClickedLike",
//           },
//         }
//       },
//       LoggedInUserHasClickedLike: {
//         // invoke: {
//         //   id: "createUserLike",
//         //   src: (context) => createUserLike({
//         //     user_id: context.user.id,
//         //     project_id: context.project_id,
//         //   }),
//         //   onDone: {
//         //     target: "LoggedInUserHasUserLikeInContext",
//         //     actions: assign({
//         //       user_likes: (context, event) => {
//         //         // console.log('LoggedInUserHasClickedLike - user_likes', { context, event });
//         //         return ({
//         //           ...context.user_likes,
//         //           [context.project_id]: event.data,
//         //         })
//         //       },
//         //     }),
//         //   },
//         //   onError: "LoggedInUserHasNotLiked"
//         // },
//       },
//       LoggedInUserHasReferralLink: {
//         invoke: {
//           id: "updateUserInDB",
//           src: (context) => updateUserInDB(context.user),
//           onDone: {
//             target: "LoggedInUserSuccessfullyUpdatedInDB",
//             actions: assign({
//               user: (_, event) => {
//                 // console.log('LoggedInUserHasReferralLink - user', { event });
//                 return event.data
//               },
//             }),
//           },
//           onError: "Idle"
//         },
//       },
//       LoggedInUserSuccessfullyUpdatedInDB: {
//         type: "final",
//       },
//       UserIsNotInContext: {
//         invoke: {
//           id: "getUserFromDB",
//           src: () => getUserFromDB(),
//           onDone: {
//             target: "LoggedInUserIsInContext",
//             actions: assign({
//               user: (_, event) => {
//                 console.log('UserIsNotInContext - user', { event });
//                 return event.data
//               },
//             }),
//           },
//           onError: "NotLoggedInUserInitial"
//         }
//       },
//       NotLoggedInUserInitial: {
//         always: [
//           {
//             cond: "isReferralLinkInContext",
//             target: "NotLoggedInUserHasReferralLink",
//           },
//           {
//             cond: "IsUserLikeInContext",
//             target: "NotLoggedInUserHasUserLikeInContext",
//           },
//           {
//             target: "NotLoggedInUserShowingLikeButton"
//           }
//         ]
//       },
//       NotLoggedInUserHasReferralLink: {},
//       NotLoggedInUserShowingLikeButton: {
//         on: {
//           NOT_LOGGED_IN_USER_CLICKED_LIKE: {
//             actions: assign({
//               user_likes: (context, event) => {
//                 // console.log('NotLoggedInUserShowingLikeButton - createUserLike', { context, event });
//                 return ({
//                   ...context.user_likes,
//                   [context.project_id]: event.data,
//                 })
//               },
//             }),
//             target: "NotLoggedInUserHasUserLikeInContext",
//           },
//         }
//       },
//       NotLoggedInUserHasUserLikeInContext: {
//         on: {
//           USER_UPDATES_PROJECT_DONATION_AMOUNT: {
//             actions: assign({
//               project_donation_amount: (_, event) => {
//                 // console.log('NotLoggedInUserHasUserLikeInContext - createUserLike', { event });
//                 return event.data
//               },
//             }),
//           },
//           USER_UPDATES_IS_RECURRING: {
//             actions: assign({
//               project_donation_is_recurring: (_, event) => {
//                 // console.log('NotLoggedInUserHasUserLikeInContext - createUserLike', { event });
//                 return event.data
//               }
//             }),
//           },
//           USER_CLICKED_DONATE: {
//             target: "NotLoggedInUserHasClickedDonate",
//           },
//         }
//       },
//       NotLoggedInUserHasClickedDonate: {
//         invoke: {
//           id: "createStripeCheckoutSession",
//           src: (context) => createStripeCheckoutSession({
//             project_id: context.project_id,
//             referring_id: context.referring_id,
//             project_donation_amount: context.project_donation_amount,
//             project_donation_is_recurring: context.project_donation_is_recurring,
//             sucess_url: window.location.href,
//           }),
//           onDone: {
//             target: "NotLoggedInUserHasStripeClientSecretInContext",
//             actions: assign({
//               stripe_client_secret: (_, event) => {
//                 // console.log('NotLoggedInUserHasClickedDonate - stripe_client_secret', { event });
//                 return event.data
//               },
//             }),
//           },
//           onError: "Idle"
//         },
//       },
//       NotLoggedInUserHasStripeClientSecretInContext: {
//         on: {
//           SESSION_ID_RECEIVED: {
//             target: 'NotLoggedInUserHasSessionId',
//             actions: assign({
//               stripe_session_id: (_, event) => {
//                 // console.log('NotLoggedInUserHasStripeClientSecretInContext - stripe_session_id', { event });
//                 return event.data
//               },
//             })
//           },
//         }
//       },
//       NotLoggedInUserHasSessionId: {
//         invoke: {
//           id: "getStripeSession",
//           src: (context) => getStripeSession(context.stripe_session_id),
//           onDone: {
//             target: "NotLoggedInUserHasStripeSessionObject",
//             actions: assign({
//               stripe_customer_id: (_, event) => {
//                 // console.log('getStripeSession - stripe_customer_id', { event });
//                 return event.data.customer
//               },
//               stripe_session_id: (_, event) => {
//                 // console.log('getStripeSession - stripe_session_id', { event });
//                 return event.data
//               },
//               user: (context, event) => {
//                 // console.log('getStripeSession - user', { context, event });
//                 return ({
//                   ...context.user,
//                   email: event.data.customer_details.email,
//                   user_metadata: {
//                     ...context.user.user_metadata,
//                     stripe_customer_id: event.data.customer,
//                     email: event.data.customer_details.email,
//                     name: event.data.customer_details.name,
//                     phone: event.data.customer_details.phone,
//                     city: event.data.customer_details.address.city,
//                     country: event.data.customer_details.address.country,
//                     address_line1: event.data.customer_details.address.line1,
//                     address_line2: event.data.customer_details.address.line2,
//                     postal_code: event.data.customer_details.address.postal_code,
//                     state: event.data.customer_details.address.state,
//                   },
//                 })
//               },
//             }),
//           },
//           onError: "Idle"
//         },
//       },
//       NotLoggedInUserHasStripeSessionObject: {
//         // invoke: {
//         //   id: 'signInOrCreateUser',
//         //   src: (context) => signInOrCreateUser(context.user.email),
//         //   onDone: {
//         //     target: 'Idle',
//         //   },
//         //   onError: {
//         //     target: 'Idle',
//         //   },
//         // },
//       },
//     },
//   },
//   {
//     actions: {},
//     guards: {
//       isUserInContext: (context) => {
//         if (context.user.id !== "") {
//           return true;
//         }
//         return false;
//       },
//       isReferralLinkInContext: (context) => {
//         if (context.referral_links[context.project_id] !== undefined) {
//           return true;
//         }
//         return false;
//       },
//       IsUserLikeInContext: (context) => {
//         if (context.user_likes[context.project_id] !== undefined) {
//           return true;
//         }
//         return false;
//       }
//     },
//     delays: {},
//   },
// );

// export default projectLikeMachine;