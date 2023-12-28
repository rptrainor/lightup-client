import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { type JSX } from 'solid-js';

export const queryClient = new QueryClient();

type Props = {
  children: JSX.Element;
};

const SolidQueryProvider = (props: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SolidQueryDevtools initialIsOpen={true} />
      {props.children}
    </QueryClientProvider>
  );
};

export default SolidQueryProvider;
