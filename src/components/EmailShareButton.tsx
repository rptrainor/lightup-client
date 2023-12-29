type Props = {
  text: string
  url: string
}

const EmailShareButton = (props: Props) => {
  const shareViaEmail = () => {
    const emailLink = `mailto:?subject=${encodeURIComponent(props.text)}&body=${encodeURIComponent(props.text + ' ' + props.url)}`;
    window.location.href = emailLink;
  };

  return (
    <button onClick={shareViaEmail} class="bg-brand_black text-brand_white w-full h-12 sm:h-16 p-2 justify-center items-center border-solid border-4 border-brand_black flex">
      <span class="sr-only">
        Share via Email
      </span>
      <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:h-12 sm:w-12">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z" fill="currentColor" />
      </svg>
    </button>
  );
}

export default EmailShareButton;