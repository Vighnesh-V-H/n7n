import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/lib/auth";
import type { User, Session } from "better-auth";
import { logger } from "@/lib/logger";
import superjson from "superjson";
import { polarClient } from "@/lib/polar";

export interface Context extends Record<string, unknown> {
  user: User | null;
  session: Session | null;
}

export const createContext = async (
  opts: FetchCreateContextFnOptions
): Promise<Context> => {
  try {
    const session = await auth.api.getSession({
      headers: opts.req.headers,
    });

    return {
      user: session?.user || null,
      session: session?.session || null,
    };
  } catch (error) {
    logger.error("Failed to create tRPC context", error);
    return {
      user: null,
      session: null,
    };
  }
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    logger.warn("Unauthorized access attempt");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

export const premiumProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    logger.warn("Unauthorized access attempt");
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  try {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.user.id,
    });

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This feature requires a premium subscription",
      });
    }

    return next({
      ctx: {
        user: ctx.user,
        session: ctx.session,
      },
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    logger.error("Failed to check subscription status", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to verify subscription status",
    });
  }
});
