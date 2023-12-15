import { Show } from "solid-js";
import { userState } from "~/stores/auth_store";

const ProfileButton = () => {

  return (
    <Show when={userState().status === "loggedIn"} fallback={null}>
      <div class="flex justify-center items-center">
        <a class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-solid border-brand_yellow border-2">
          <Show when={userState().user?.avatar_url} fallback={<span>{userState().user?.name?.[0]}</span>}>
            <img src={userState().user?.avatar_url} alt="User Profile" class="w-full h-full object-cover" />
          </Show>
        </a>
      </div>
    </Show>
  );
}

export default ProfileButton;