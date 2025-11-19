import { generateSlug } from "random-word-slugs";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { workflow } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";

export const workflowRouter = {
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const [wf] = await db
      .insert(workflow)
      .values({ name: generateSlug(3), userId: ctx.user.id })
      .returning()
      .execute();

    return wf;
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await db
        .delete(workflow)
        .where(and(eq(workflow.id, input.id), eq(workflow.userId, ctx.user.id)))
        .returning()
        .execute();
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(workflow)
        .set({ name: input.name })
        .where(and(eq(workflow.id, input.id), eq(workflow.userId, ctx.user.id)))
        .returning()
        .execute();
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const wf = await db
        .select()
        .from(workflow)
        .where(
          and(eq(workflow.id, input.id), eq(workflow.userId, ctx.user.id))
        );
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const wfs = await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, ctx.user.id));
    return wfs;
  }),
} satisfies TRPCRouterRecord;
