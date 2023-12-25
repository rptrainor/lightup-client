import { createSignal, Show } from "solid-js";

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
  const [email, setEmail] = createSignal<string>("");
  return (
    <Show when={email() !== ""} fallback={
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
        <div class="relative mt-2 rounded-md shadow-sm">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
          </div>
          <input type="email" name="email" id="email" class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="you@example.com" />
        </div>
      </div>
    }>
      <div class="flex gap-4 flex-wrap w-full justify-center items-baseline">
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
    </Show>
  );
}

