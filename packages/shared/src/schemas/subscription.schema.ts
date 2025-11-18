import { z } from "zod";

export const planSchema = z.enum(["free", "pro"]);

export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  plan: planSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const workflowLimitsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  maxWorkflows: z.number(),
  maxWorkflowRuns: z.number(),
  maxNodesPerWorkflow: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const checkPlanOutputSchema = z.object({
  plan: planSchema,
  limits: workflowLimitsSchema,
  isPro: z.boolean(),
  isFree: z.boolean(),
});

export type Plan = z.infer<typeof planSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type WorkflowLimits = z.infer<typeof workflowLimitsSchema>;
export type CheckPlanOutput = z.infer<typeof checkPlanOutputSchema>;
