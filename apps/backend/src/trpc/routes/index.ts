import { router } from "../trpc";
import { healthRouter } from "./health";
import { authRouter } from "./auth";
import { subscriptionRouter } from "./subscription";

export const appRouter = router({
  health: healthRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;
