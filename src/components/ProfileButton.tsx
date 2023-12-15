import { Show } from "solid-js";
import { userState } from "~/stores/auth_store";

const ProfileButton = () => {
  return (
    <Show when={userState().status === "loggedIn"} fallback={null}>
      <div class="flex justify-center items-center z-10">
        <a class="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand_pink flex items-center justify-center overflow-hidden border-solid border-brand_black border-2">
          <Show when={userState().user?.avatar_url} fallback={
            <p class="text-3xl uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#101214" class="w-4 h-4 sm:w-8 sm:h-8">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
              </svg>
            </p>}>
            <img src={userState().user?.avatar_url} alt="User Profile" class="w-full h-full object-cover" />
          </Show>
        </a>
      </div>
    </Show>
  );
}

export default ProfileButton;