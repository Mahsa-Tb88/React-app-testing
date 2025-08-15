import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";
import { CartProvider } from "../src/providers/CartProvider";
import { Theme } from "@radix-ui/themes";

export default function AllProvider({ children }: PropsWithChildren) {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      <CartProvider>
        <Theme>{children}</Theme>
      </CartProvider>
    </QueryClientProvider>
  );
}
