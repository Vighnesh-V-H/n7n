import { router, publicProcedure, protectedProcedure } from "@/lib/trpc";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  // Get current session/user
  getSession: publicProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
      session: ctx.session,
    };
  }),

  // Get current user (protected)
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
