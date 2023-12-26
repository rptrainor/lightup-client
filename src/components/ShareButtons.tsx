import FacebookShareButton from "./FacebookShareButton";
import TwitterShareButton from "./TwitterShareButton";
import MessageShareButton from "./MessageShareButton";
import WhatsAppShareButton from "./WhatsAppShareButton";
import LinkedInShareButton from "./LinkedInShareButton";
import TelegramShareButton from "./TelegramShareButton";
import PinterestShareButton from "./PinterestShareButton";
import RedditShareButton from "./RedditShareButton";
import EmailShareButton from "./EmailShareButton";
import CopyShareButton from "./CopyShareButton";

type Props = {
  text: string;
  url: string;
  image: string;
}

export default function ShareButtons(props: Props) {
  return (
    <div class="flex gap-2 sm:gap-4 flex-wrap w-full justify-center items-baseline">
      <CopyShareButton text={props.text} url={props.url} />
      <TwitterShareButton text={props.text} url={props.url} />
      <LinkedInShareButton url={props.url} />
      <MessageShareButton text={props.text} url={props.url} />
      <RedditShareButton text={props.text} url={props.url} />
      <EmailShareButton text={props.text} url={props.url} />
      <TelegramShareButton text={props.text} url={props.url} />
      <WhatsAppShareButton text={props.text} url={props.url} />
      <FacebookShareButton url={props.url} />
      <PinterestShareButton text={props.text} url={props.url} image={props.image} />
    </div>
  );
}

