import { router } from "@/lib/trpc";
import { createTRPCRouter, healthRouter } from "./health";
import { authRouter } from "./auth";
import { initTRPC } from "@trpc/server";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
