import { createQuery } from "@tanstack/solid-query";
import fetchSupabaseUser from "~/utilities/fetchSupabaseUser";

import { queryClient } from "~/components/SolidQueryProvider";

const createFetchSupabaseUser = () => {
  return createQuery(
    () => ({
      queryKey: ["user"],
      queryFn: () => fetchSupabaseUser(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 15 * 60 * 1000, // 15 minutes
      // enabled: !props.userAlreadyLoaded
    }),
    () => queryClient
  );
};

export default createFetchSupabaseUser;