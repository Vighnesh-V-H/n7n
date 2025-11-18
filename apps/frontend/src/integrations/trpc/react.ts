import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { AppRouter } from '@n7n/backend/trpc'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
