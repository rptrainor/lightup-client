type Props = {
  url: string;
  text: string;
}

const TelegramShareButton = (props: Props) => {
  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.text)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <button onClick={shareOnTelegram} class="bg-brand_black text-brand_white w-12 h-12 p-2 justify-center items-center border-solid border-4 border-brand_black">
      <span class="sr-only">Share on Telegram</span>
      <svg class="w-6 h-6" width="800px" height="800px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="currentColor" stroke-width="12" d="M23.073 88.132s65.458-26.782 88.16-36.212c8.702-3.772 38.215-15.843 38.215-15.843s13.621-5.28 12.486 7.544c-.379 5.281-3.406 23.764-6.433 43.756-4.54 28.291-9.459 59.221-9.459 59.221s-.756 8.676-7.188 10.185c-6.433 1.509-17.027-5.281-18.919-6.79-1.513-1.132-28.377-18.106-38.214-26.404-2.649-2.263-5.676-6.79.378-12.071 13.621-12.447 29.891-27.913 39.728-37.72 4.54-4.527 9.081-15.089-9.837-2.264-26.864 18.483-53.35 35.835-53.35 35.835s-6.053 3.772-17.404.377c-11.351-3.395-24.594-7.921-24.594-7.921s-9.08-5.659 6.433-11.693Z" /></svg>
    </button>
  );
}

export default TelegramShareButton;