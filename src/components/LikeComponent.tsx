import { createEffect, createSignal } from "solid-js";
import { userState } from "~/stores/auth_store";
import likeProject from "~/utilities/likeProject";
import checkLikeStatus from "~/utilities/checkLikeStatus";

type Props = {
  projectId: string;
}

export default function LikeComponent(props: Props) {
  const [isLiked, setIsLiked] = createSignal<boolean | null>(null)

  createEffect(async () => {
    if (userState().user?.id && props.projectId) {
      const status = await checkLikeStatus({ userId: userState().user?.id ?? "", projectId: props.projectId });
      setIsLiked(status)
    }
  });

  createEffect(() => {
    if (isLiked() === false && userState().user?.id && props.projectId) {
      likeProject({ userId: userState().user?.id ?? "", projectId: props.projectId });
    }
  })
  return null;
}
