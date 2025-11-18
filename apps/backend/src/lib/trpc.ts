import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context as HonoContext } from "hono";
import { auth } from "./auth";
import type { User, Session } from "better-auth";
import { logger } from "./logger";
import superjson from "superjson";

export interface Context extends Record<string, unknown> {
  user: User | null;
  session: Session | null;
}

// export const createContext = async (
//   opts: FetchCreateContextFnOptions,
//   c: HonoContext
// ): Promise<Context> => {
//   try {
//     const session = await auth.api.getSession({
//       headers: opts.req.headers,
//     });

//     return {
//       user: session?.user || null,
//       session: session?.session || null,
//     };
//   } catch (error) {
//     logger.error("Failed to create tRPC context", error);
//     return {
//       user: null,
//       session: null,
//     };
//   }
// };

const t = initTRPC.create({
  transformer: superjson,
});

// export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
//   if (!ctx.user || !ctx.session) {
//     logger.warn("Unauthorized access attempt");
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "You must be logged in to access this resource",
//     });
//   }

//   return next({
//     ctx: {
//       user: ctx.user,
//       session: ctx.session,
//     },
//   });
// });
