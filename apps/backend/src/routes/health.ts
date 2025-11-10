import { router, publicProcedure } from "@/lib/trpc";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const healthRouter = router({
  check: publicProcedure.query(() => {
    logger.info("Health check endpoint called");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }),

  ping: publicProcedure
    .input(z.object({ message: z.string().optional() }))
    .query(({ input }) => {
      logger.debug(`Ping received with message: ${input.message || "none"}`);
      return {
        pong: true,
        message: input.message || "pong",
      };
    }),
});
