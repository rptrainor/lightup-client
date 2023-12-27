type Props = {
  onClose: () => void;
  Header: string;
  SubHeader: string;
};

const ErrorNotification = (props: Props) => {
  return (
    <div
      class="pointer-events-auto w-[300px] max-w-sm overflow-hidden bg-utility_danger_tint shadow-lg ring-1 ring-brand_black ring-opacity-5 transition-transform ease-out duration-300"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-brand_black">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

          </div>
          <a href="mailto:ryan@lightup.fyi" class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm text-brand_black">{props.Header ?? "Looks like somethign went wrong"}</p>
            <p class="mt-1 text-sm text-gray-600">{props.SubHeader ?? "Please try again, and"}</p>
            <p class="mt-1 text-sm text-gray-600">Click here to email us at ryan@lightup.fyi</p>
          </a>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-utility_danger_shade focus:ring-offset-2 border-solid"
              onClick={props.onClose}
            >
              <span class="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
