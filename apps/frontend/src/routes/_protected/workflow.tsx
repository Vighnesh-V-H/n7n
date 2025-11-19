import { createServerFn } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '@/middleware/auth'
import { FullPageLoader } from '@/components/ui/loader'
import { Workflows } from '@/components/workflows'

const checkAuth = createServerFn().handler(async () => {
  await requireAuth()
})

export const Route = createFileRoute('/_protected/workflow')({
  component: WorkflowPage,
  pendingComponent: FullPageLoader,
  loader: () => checkAuth,
})

function WorkflowPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 p-8">
        <div className="mx-auto max-w-6xl">
          <Workflows />
        </div>
      </div>
    </div>
  )
}
