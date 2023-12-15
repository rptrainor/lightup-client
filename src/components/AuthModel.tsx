import { createSignal } from "solid-js";

import Button from "~/components/Button";
import { user } from "~/stores/auth_store";
import handleSignInWithGoogleAuth from "~/utilities/handleSignInWithGoogle";
import handleSignInWithEmailAuth from "~/utilities/handleSignInWithEmail";


const AuthModel = () => {
  const [dismissed, setDismissed] = createSignal<boolean>(false);
  const [email, setEmail] = createSignal<string>("");

  // Validate email format
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form submission
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (isValidEmail(email())) {
      handleSignInWithEmailAuth(email());
    }
  };

  if (user() || dismissed()) {
    return null;
  }

  return (
    <div
      class='w-64 sm:w-72 border-4 border-solid border-brand_black fixed right-1 bottom-2 sm:bottom-4 sm:right-2 bg-brand_white pt-16 sm:pt-20 pb-2 px-2 sm:px-4 flex flex-col items-center gap-2 sm:gap-4 z-20'
    >
      {/* <!-- SVG Close Icon --> */}
      <Button
        class='absolute top-2 right-2 h-6 w-6 flex items-center justify-center text-gray-700 hover:text-gray-800'
        aria-label='Close'
        title='Close'
        onClick={() => setDismissed(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M6 18L18 6M6 6l12 12'></path>
        </svg>
      </Button>
      <img
        class='object-cover rounded-full border-solid border-4 border-brand_black h-32 sm:h-40 w-32 sm:w-40 absolute -mt-16 sm:-mt-20 top-0'
        src='https://imagedelivery.net/xHZxKHrwCcaO8iTco-Njhg/b9e35925-14a2-4eab-3732-750c68910c00/small'
        alt="Ryan's profile image. Nice to meet you, let's chat! My email is ryan@lightup.fyi"
      />
      <div class='flex flex-col justify-center h-full gap-2 mt-16 sm:mt-20'>
        <p class='text-sm sm:text-base'>
          Hi! I'm Ryan, one of the Co-Founders of Lightup
        </p>
        <p class='text-xs sm:text-sm'>
          We would like to send you a gift, could you share your email and we will
          be in touch
        </p>

        {/* <!-- Google Auth Button --> */}
        <Button
          class='bg-red-600 text-brand_white px-3 py-1 text-sm rounded hover:bg-red-700'
          aria-label='Sign in with Google'
          title='Sign in with Google'
          onClick={handleSignInWithGoogleAuth}
          autofocus
        >
          Sign in with Google
        </Button>

        {/* <!-- Divider --> */}
        <div class='relative flex py-1 items-center'>
          <div class='flex-grow border-t border-gray-300'></div>
          <span class='flex-shrink mx-2 text-gray-600 text-xs'>or</span>
          <div class='flex-grow border-t border-gray-300'></div>
        </div>

        {/* <!-- Email Form --> */}
        <form class='flex flex-col gap-1 w-full' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Your email address'
            class='px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-brand_black text-sm'
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
          <Button
            type='submit'
            aria-label='Submit'
            title='Submit'
            class='bg-brand_black text-white px-3 py-1 text-sm rounded hover:bg-gray-800'
            disabled={!email() || !isValidEmail(email())}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthModel;
