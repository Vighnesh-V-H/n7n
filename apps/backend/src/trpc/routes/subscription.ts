import { protectedProcedure } from "../trpc";
import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { polarClient } from "@/lib/polar";

export const subscriptionRouter = {
  checkPlan: protectedProcedure.query(async ({ ctx }) => {
    try {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.user.id,
      });

      const hasActiveSubscription =
        customer.activeSubscriptions && customer.activeSubscriptions.length > 0;

      return {
        isPremium: hasActiveSubscription,
        isFree: !hasActiveSubscription,
        activeSubscriptions: customer.activeSubscriptions || [],
      };
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch subscription status",
      });
    }
  }),
} satisfies TRPCRouterRecord;
