import { router } from "@/lib/trpc";
import superjson from "superjson";
import { logger } from "@/lib/logger";
import {
  pingInputSchema,
  type HealthCheckOutput,
  type PingOutput,
} from "@repo/shared/schemas";
import { initTRPC, type TRPCRouterRecord } from "@trpc/server";

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const healthRouter = {
  check: publicProcedure.query(() => {
    logger.info("Health check endpoint called");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),

  ping: publicProcedure
    .input(pingInputSchema)
    .query(({ input }): PingOutput => {
      logger.debug(`Ping received with message: ${input.message || "none"}`);
      return {
        pong: true,
        message: input.message || "pong",
      };
    }),
} satisfies TRPCRouterRecord;
