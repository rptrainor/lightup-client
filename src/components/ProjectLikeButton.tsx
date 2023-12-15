import { createSignal } from "solid-js";

type Project = {
  project: {
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
  };
}

const ProjectLikeButton = (project: Project) => {
  const [isLiked, setIsLiked] = createSignal<boolean>(false)
  return (
    <button
      class='bg-brand_pink sm:px-6 border-4 border-brand_black to-brand_black w-full sm:mt-2 uppercase gap-2 fixed sm:sticky sm:top-0 bottom-0 left-0 right-0 h-24 group'
      onClick={() => setIsLiked(prevValue => !prevValue)}
    >
      <h1 class="text-brand_black font-black bg-brand_pink flex sm:flex-row-reverse flex-nowrap items-center justify-around">
        <span class="flex">Like</span>
        <div class="bg-brand_white rounded-full p-2 flex flex-nowrap justify-center items-center group-hover:scale-75 transition-all">
          {isLiked() ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16 group-hover:scale-110 transition-transform">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 transition-transform animate-wiggle">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </div>
      </h1>
    </button>
  );
}

export default ProjectLikeButton;