type Props = {
  text: string;
  url: string;
}

const CopyShareButton = (props: Props) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.text + " " + props.url);
      //TODO: TELL THE USER VIA NOTIFICATION THAT THE LINK IS COPIED
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={copyToClipboard} class="bg-brand_black text-brand_white w-12 h-12 p-2 justify-center items-center border-solid border-4 border-brand_black">
      <span class="sr-only">Copy link</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>

    </button>
  );
}

export default CopyShareButton;


