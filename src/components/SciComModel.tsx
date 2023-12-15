import { createSignal, Show } from "solid-js";

export const prerender = true;

const SciComModel = () => {
  const [dismissed, setDismissed] = createSignal<boolean>(false);

  const handleClose = () => {
    console.log("close")
    setDismissed(true);
  }

  return (
    <body class='relative'>
      <iframe
        name="sci-hub"
        title="sci-hub"
        src='https://sci-hub.se/'
        class='absolute top-0 left-0 w-screen h-screen border-none z-0'></iframe>
      <Show when={!dismissed()} fallback={null}>
          <div
            class='w-full sm:w-64 md:w-72 border-4 border-solid border-brand_black fixed inset-x-0 mx-auto bottom-0 sm:bottom-[50vh] bg-brand_white pt-8 sm:pt-16 pb-2 px-2 sm:px-4 flex flex-col items-center gap-2 sm:gap-4 z-20'
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
              <div class="flex flex-nowrap gap-2">
                <button class="bg-brand_pink text-brand_black border-4 border-brand_black">
                  Manage Lightup subscription
                </button>
                <button class="bg-brand_blue text-brand_black border-4 border-brand_black">
                  Log out of Lightup
                </button>
              </div>
              <a href="mailto:ryan@lightup.fyi" class="bg-brand_yellow text-brand_black w-full text-center border-4 border-brand_black">
                Email Ryan
              </a>
              <p>
                Also, while you're here, let's shine a light on Sci-Hub's mission to provide free and unrestricted access to all scientific knowledge
              </p>
              <img src="https://imagedelivery.net/xHZxKHrwCcaO8iTco-Njhg/14b9a8f7-9183-4768-b53f-f77cd8a87f00/small" alt="Ryan's signature" class="w-16 h-8 mx-4" />
            </div>
          </div>
      </Show>
    </body>
  );
};

export default SciComModel;
