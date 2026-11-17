import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Keep "/page/" and "/page" both rendering so ready-made pages build without redirect loops.
    trailingSlash: "preserve",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
