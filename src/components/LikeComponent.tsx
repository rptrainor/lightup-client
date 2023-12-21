import { createEffect, createSignal } from "solid-js";
import { userState } from "~/stores/auth_store";
import likeProject from "~/utilities/likeProject";
import checkLikeStatus from "~/utilities/checkLikeStatus";
import type { Project } from "~/components/ProjectLikeButton";

type Props = {
  project: Project;
}

export default function LikeComponent(props: Props) {
  const [isLiked, setIsLiked] = createSignal<boolean | null>(null)

  console.log("LikeComponent - RENDER")

  createEffect(async () => {
    console.log("LikeComponent - onMount", { userState: userState() })
    console.log("LikeComponent - onMount", { projectId: props.project.id })

    if (userState().user?.id && props.project.id) {
      const status = await checkLikeStatus({ userId: userState().user?.id ?? "", projectId: props.project.id });
      console.log('LikeComponent', { status })
      setIsLiked(status)
    }
  });

  createEffect(() => {
    if (isLiked() === false && userState().user?.id && props.project.id) {
      console.log('LIKING THE PROJECT NOW')
      likeProject({ userId: userState().user?.id ?? "", projectId: props.project.id });
    }
  })
  return null;
}
