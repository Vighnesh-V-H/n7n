import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from './init'

import type { TRPCRouterRecord } from '@trpc/server'

export type { TRPCRouter } from './backend-types'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

const todosRouter = {
  list: publicProcedure.query(() => todos),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newTodo = { id: todos.length + 1, name: input.name }
      todos.push(newTodo)
      return newTodo
    }),
} satisfies TRPCRouterRecord

// This router is for demo purposes only
// The actual tRPC client uses the backend AppRouter
export const trpcRouter = createTRPCRouter({
  todos: todosRouter,
})
