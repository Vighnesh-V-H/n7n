import { router } from "../trpc";
import { healthRouter } from "./health";
import { subscriptionRouter } from "./subscription";
import { workflowRouter } from "./workflow";

export const appRouter = router({
  health: healthRouter,
  subscription: subscriptionRouter,
  workflow: workflowRouter,
});

export type AppRouter = typeof appRouter;
