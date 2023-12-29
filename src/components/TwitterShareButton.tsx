type Props = {
  url: string;
  text: string;
}

const TwitterShareButton = (props: Props) => {
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.text)}&url=${encodeURIComponent(props.url)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <button onClick={shareOnTwitter} class="bg-brand_black text-brand_white w-full h-12 sm:h-16 p-2 justify-center items-center border-solid border-4 border-brand_black flex">
      <span class="sr-only">
        Share on Twitter
      </span>
      <svg class="w-6 h-6 sm:h-12 sm:w-12" width="1200" height="1227" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
      </svg>

    </button>
  );
}

export default TwitterShareButton;
