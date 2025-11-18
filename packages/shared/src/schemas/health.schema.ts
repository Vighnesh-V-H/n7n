import { z } from "zod";

export const healthCheckInputSchema = z.object({});

export const healthCheckOutputSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
});

// Ping schemas
export const pingInputSchema = z.object({
  message: z.string().optional(),
});

export const pingOutputSchema = z.object({
  pong: z.literal(true),
  message: z.string(),
});

export type HealthCheckInput = z.infer<typeof healthCheckInputSchema>;
export type HealthCheckOutput = z.infer<typeof healthCheckOutputSchema>;
export type PingInput = z.infer<typeof pingInputSchema>;
export type PingOutput = z.infer<typeof pingOutputSchema>;
