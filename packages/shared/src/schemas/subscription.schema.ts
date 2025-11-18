import { z } from "zod";

export const subscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "past_due",
  "trialing",
]);

export const subscriptionInputSchema = z.object({
  userId: z.string(),
});

export const subscriptionOutputSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: subscriptionStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionInputSchema>;
export type SubscriptionOutput = z.infer<typeof subscriptionOutputSchema>;
