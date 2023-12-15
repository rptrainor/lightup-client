import { createSignal, Show } from "solid-js";
import { supabase } from "~/db/connection";

const SciComModel = () => {
  const [dismissed, setDismissed] = createSignal<boolean>(false);

  const handleClose = () => {
    setDismissed(true);
  }

  // Stop propagation function
  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation();
  }

  const handleEmailClick = () => {
    window.location.href = 'mailto:ryan@lightup.fyi';
  }

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut()
    window.location.href = window.location.origin;
    if (error) {
      console.error(error)
    }
  }

  return (
    <Show when={!dismissed()} fallback={null}>
      <div class="fixed inset-0 bg-black/30 z-10" onClick={handleClose}>
        <div
          class='w-full sm:min-w-min sm:max-w-2xl text-brand_black border-4 border-solid border-brand_black fixed inset-x-0 mx-auto bottom-0 sm:bottom-[40vh] bg-brand_white pt-8 sm:pt-12 pb-2 px-2 sm:px-4 flex flex-col items-center gap-2 sm:gap-4 z-50'
          onClick={stopPropagation}  // Prevents click inside the modal from closing it
        >
          {/* <!-- SVG Close Icon --> */}
          <button
            class='absolute top-2 right-2 h-6 w-6 flex items-center justify-center text-brand_black hover:text-brand_black/70'
            aria-label='Close'
            title='Close'
            onClick={handleClose}
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
          </button>
          <div class='flex flex-col justify-center items-end h-full gap-2 text-xl font-bold'>
            <div class="flex flex-nowrap gap-2 w-full">

              {/* //TODO: Add links to manage subscription */}
              <button class="bg-brand_pink text-brand_black border-4 border-brand_black px-2 sm:px-4 py-2 w-full">
                Manage Lightup subscription
              </button>
              <button onClick={handleLogout} class="bg-brand_blue text-brand_black border-4 border-brand_black px-2 sm:px-4 py-2 w-full">
                Log out of Lightup
              </button>
            </div>
            <button onClick={handleEmailClick} class="bg-brand_yellow text-brand_black text-center border-4 border-brand_black px-4 py-2 w-full">
              Email Ryan
            </button>
            <p>
              Also, while you're here, let's shine a light on Sci-Hub's mission to provide free and unrestricted access to all scientific knowledge
            </p>
            <img src="https://imagedelivery.net/xHZxKHrwCcaO8iTco-Njhg/14b9a8f7-9183-4768-b53f-f77cd8a87f00/small" alt="Ryan's signature" class="w-16 h-8 mx-4" />
          </div>
        </div>
      </div>
    </Show>
  );
};

export default SciComModel;
