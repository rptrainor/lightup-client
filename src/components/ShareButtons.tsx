import FacebookShareButton from "~/components/Buttons/FacebookShareButton";
import TwitterShareButton from "~/components/Buttons/TwitterShareButton";
import MessageShareButton from "~/components/Buttons/MessageShareButton";
import WhatsAppShareButton from "~/components/Buttons/WhatsAppShareButton";
import LinkedInShareButton from "~/components/Buttons/LinkedInShareButton";
import TelegramShareButton from "~/components/Buttons/TelegramShareButton";
import PinterestShareButton from "~/components/Buttons/PinterestShareButton";
import RedditShareButton from "~/components/Buttons/RedditShareButton";
import EmailShareButton from "~/components/Buttons/EmailShareButton";
import CopyShareButton from "~/components/Buttons/CopyShareButton";

type Props = {
  text: string;
  url: string;
  image: string;
}

export default function ShareButtons(props: Props) {
  return (
    <div class="gap-2 sm:gap-4 flex-wrap w-full justify-center items-baseline grid grid-cols-5">
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

