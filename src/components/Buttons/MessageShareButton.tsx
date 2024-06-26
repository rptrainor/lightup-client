type Props = {
  text: string
  url: string
}

const MessageShareButton = (props: Props) => {
  const shareViaSMS = () => {
    const smsUrl = `sms:&body=${encodeURIComponent(props.text + " " + props.url)}`;
    window.open(smsUrl, '_blank');
  };

  return (
    <button onClick={shareViaSMS} class="bg-brand_black text-brand_white w-full h-12 sm:h-16 p-2 justify-center items-center border-solid border-4 border-brand_black flex">
      <span class="sr-only">
        Share via Text
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6 sm:h-12 sm:w-12">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    </button>
  );
}

export default MessageShareButton;
