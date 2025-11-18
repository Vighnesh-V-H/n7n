import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { TRPCRouter } from './backend-types'

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>()
