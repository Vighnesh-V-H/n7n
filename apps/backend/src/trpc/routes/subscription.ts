import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { db } from "@/db";
import { subscription, workflowLimits } from "@/db/schema";
import { eq } from "drizzle-orm";

export const subscriptionRouter = {
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [userSubscription] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    if (!userSubscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    return userSubscription;
  }),

  getWorkflowLimits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [limits] = await db
      .select()
      .from(workflowLimits)
      .where(eq(workflowLimits.userId, userId))
      .limit(1);

    if (!limits) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workflow limits not found",
      });
    }

    return limits;
  }),

  upgradeToPro: protectedProcedure
    .input(
      z.object({
        paymentCompleted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.paymentCompleted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment not completed",
        });
      }

      const userId = ctx.user.id;

      await db
        .update(subscription)
        .set({
          plan: "pro",
          updatedAt: new Date(),
        })
        .where(eq(subscription.userId, userId));

      await db
        .update(workflowLimits)
        .set({
          maxWorkflows: -1,
          maxWorkflowRuns: -1,
          maxNodesPerWorkflow: -1,
          updatedAt: new Date(),
        })
        .where(eq(workflowLimits.userId, userId));

      return {
        success: true,
        message: "Successfully upgraded to Pro plan",
      };
    }),

  checkPlan: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [userSubscription] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    const [limits] = await db
      .select()
      .from(workflowLimits)
      .where(eq(workflowLimits.userId, userId))
      .limit(1);

    if (!userSubscription || !limits) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription or limits not found",
      });
    }

    return {
      plan: userSubscription.plan,
      limits: limits,
      isPro: userSubscription.plan === "pro",
      isFree: userSubscription.plan === "free",
    };
  }),
} satisfies TRPCRouterRecord;
