import { createQuery } from "@tanstack/solid-query";
import fetchSupabaseUser from "~/utilities/fetchSupabaseUser";

import { queryClient } from "~/components/SolidQueryProvider";

const useFetchSupabaseUser = () => {
  return createQuery(
    () => ({
      queryKey: ["user"],
      queryFn: () => fetchSupabaseUser(),
    }),
    () => queryClient
  );
};

export default useFetchSupabaseUser;