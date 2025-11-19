import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoader } from '@/components/ui/loader'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/dashboard')({
  component: Dashboard,
  pendingComponent: FullPageLoader,
})

function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 p-8">
        <div className="mx-auto max-w-6xl">
          <Button onClick={() => console.log('Create workflow')}>
            Create Workflow
          </Button>
        </div>
      </div>
    </div>
  )
}
