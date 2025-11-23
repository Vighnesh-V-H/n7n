import { createServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { requireAuth } from '@/middleware/auth'
import { FullPageLoader } from '@/components/ui/loader'
import { useTRPC } from '@/integrations/trpc/react'
import { WorkflowEditor } from '@/components/workflow-editor'

const checkAuth = createServerFn().handler(async () => {
  await requireAuth()
})

export const Route = createFileRoute('/_protected/workflow/$workflowId')({
  component: WorkflowDetailPage,
  pendingComponent: FullPageLoader,
  loader: async ({ params, context }) => {
    await checkAuth()

    await context.queryClient.ensureQueryData(
      context.trpc.workflow.getOne.queryOptions({ id: params.workflowId }),
    )
  },
})

function WorkflowDetailPage() {
  const { workflowId } = Route.useParams()
  const trpc = useTRPC()
  const { data: workflow } = useSuspenseQuery(
    trpc.workflow.getOne.queryOptions({ id: workflowId }),
  )

  if (!workflow) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Workflow not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{workflow.name ?? workflowId}</h1>
      </div>
      <div className="flex-1 rounded-xl bg-muted/50 border overflow-hidden">
        <WorkflowEditor
          initialNodes={workflow.nodes ?? []}
          initialEdges={workflow.edges ?? []}
        />
      </div>
    </div>
  )
}
