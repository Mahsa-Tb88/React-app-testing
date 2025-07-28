import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";

export default function AllProvider({ children }:PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}


