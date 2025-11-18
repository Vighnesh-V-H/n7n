import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { subscription, workflowLimits } from "@/db/schema";
import { nanoid } from "nanoid";

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  // Sign up
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signUpEmail({
          body: {
            email: input.email,
            password: input.password,
            name: input.name,
          },
        });

        if (result && result.user) {
          const userId = result.user.id;

          await db.insert(subscription).values({
            id: nanoid(),
            userId: userId,
            plan: "free",
          });

          await db.insert(workflowLimits).values({
            id: nanoid(),
            userId: userId,
            maxWorkflows: 3,
            maxWorkflowRuns: 50,
            maxNodesPerWorkflow: 10,
          });
        }

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Failed to sign up",
        });
      }
    }),

  // Sign in
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
        });

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error instanceof Error ? error.message : "Failed to sign in",
        });
      }
    }),

  // Sign out
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await auth.api.signOut({
        headers: new Headers({
          cookie: ctx.session.token,
        }),
      });

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to sign out",
      });
    }
  }),
});
