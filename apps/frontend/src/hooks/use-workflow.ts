import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC()

  return useSuspenseQuery(trpc.workflow.getMany.queryOptions())
}
