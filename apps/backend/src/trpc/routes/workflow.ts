import { generateSlug } from "random-word-slugs";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { workflow, node, NODETYPE, connection } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { and, eq } from "drizzle-orm";
import type { Edge, Node } from "@xyflow/react";

const INITIAL_NODE_TYPE = NODETYPE.enumValues[0];

export const workflowRouter = {
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const [wf] = await db
      .insert(workflow)
      .values({ name: generateSlug(3), userId: ctx.user.id })
      .returning()
      .execute();

    if (!wf) {
      throw new Error("Failed to create workflow");
    }

    await db
      .insert(node)
      .values({
        workflowId: wf.id,
        name: INITIAL_NODE_TYPE,
        type: INITIAL_NODE_TYPE,
        position: { x: 0, y: 0 },
        data: {},
      })
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
      return deleted[0];
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
      return updated;
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const wf = await db.query.workflow.findFirst({
        where: and(
          eq(workflow.id, input.id),
          eq(workflow.userId, ctx.user.id)
        ),
        with: {
          nodes: true,
          connections: true,
        },
      });

      if (!wf) return null;

      const nodes: Node[] = wf.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position as { x: number; y: number },
        data: n.data as Record<string, unknown>,
      }));

      const edges: Edge[] = wf.connections.map((c) => ({
        id: c.id,
        source: c.sourceNodeId,
        target: c.targetNodeId,
        sourceHandle: c.fromOutput,
        targetHandle: c.toInput,
      }));

      return {
        id: wf.id,
        name: wf.name,
        userId: wf.userId,
        createdAt: wf.createdAt,
        updatedAt: wf.updatedAt,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure.query(async ({ ctx }) => {
    const wfs = await db
      .select()
      .from(workflow)
      .where(eq(workflow.userId, ctx.user.id));
    return wfs;
  }),
} satisfies TRPCRouterRecord;
