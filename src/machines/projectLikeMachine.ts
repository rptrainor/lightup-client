import { createMachine } from 'xstate';

const projectLikeMachine = createMachine({
  id: 'projectLike',
  context: {
    user: {
      id: null,
      created_at: null,
      email: null,
      phone: null,
      user_metadata: {
        deleted_at: null,
        updated_at: null,
        avatar_url: null,
        full_name: null,
        city: null,
        country: null,
        address_line1: null,
        address_line2: null,
        postal_code: null,
        state: null,
        stripe_customer_id: null,
      }
    },
    user_likes: {
      //* This is the shape of the user_likes object
      //* [project_id]: userId
    },
    referral_links: {
      //* This is the shape of the referral_links object
      //* [project_id]: stripe_customer_id
    },
    stripe_client_secret: null,
    project_donation_amount: null,
    project_donation_is_recurring: false,
    project_id: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: { toggle: 'Active' },
    },
    Active: {
      on: { toggle: 'Idle' },
    },
  },
});