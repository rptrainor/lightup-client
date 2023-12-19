import { createSignal, createEffect, Switch, Match } from "solid-js";

import { userState } from "~/stores/auth_store";
import checkLikeStatus from "~/utilities/checkLikeStatus";

type Area = {
  header: string,
  body: string
}

export type Project = {
  id: string;
  title: string;
  description: string;
  header: string;
  slug: string;
  tags: string[];
  banner: {
    src: string;
    alt: string;
  };
  creator: {
    name: string;
    avatar: {
      src: string;
      alt: string;
    };
  };
  areas: Area[],
  callToAction: string,
}

type Props = {
  project: Project;
}

const ProjectLikeButton = (props: Props) => {
  const [isLiked, setIsLiked] = createSignal<boolean | null>(null);

  createEffect(async () => {
    const userId = userState().user?.id;
    if (userId) {
      const status = await checkLikeStatus({ userId, projectId: props.project.id });
      console.log('ProjectLikeButton', { status });
      setIsLiked(status);
    }
  });

  return (
    <Switch fallback={null}>
      <Match when={isLiked() === true}>
        <a href={`/${props.project.slug}/support`} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 fixed sm:sticky sm:top-0 bottom-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch >
          <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
            <span>Like</span>
            <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" class="w-16 h-16 transition-transform animate-wiggle">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>
          </h1>
        </a>
      </Match>
      <Match when={isLiked() === false}>
        <a href={`/${props.project.slug}/support`} class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 fixed sm:sticky sm:top-0 bottom-0 left-0 right-0 group z-20 max-w-[100vw]' data-astro-prefetch >
          <h1 class="text-brand_black font-black bg-brand_pink animate-breath flex sm:flex-row-reverse flex-nowrap items-center justify-center gap-4">
            <span>Like</span>
            <div class="bg-brand_white rounded-full scale-75 p-2 flex flex-nowrap justify-center items-center border-solid border-4 border-brand_black group-hover:scale-125 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
          </h1>
        </a>
      </Match>
    </Switch>
  );
}

export default ProjectLikeButton;