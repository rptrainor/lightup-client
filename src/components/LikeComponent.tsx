import { createEffect } from "solid-js";
import { userState } from "~/stores/auth_store";
import likeProject from "~/utilities/likeProject";
import type { Project } from "~/components/ProjectLikeButton";

type Props = {
  project: Project;
}

export default function LikeComponent(props: Props) {
  createEffect(async () => {
    const userId = userState().user?.id;
    if (userId && props.project.id) {
      await likeProject({ userId, projectId: props.project.id });
    }
  });
  return null;
}
