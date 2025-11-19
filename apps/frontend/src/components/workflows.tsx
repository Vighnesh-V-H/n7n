import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/integrations/trpc/react'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'

export function Workflows() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)

  const { data: workflows, isLoading } = useQuery(
    trpc.workflow.getMany.queryOptions(),
  )

  const handleCreateWorkflow = async () => {
    try {
      setIsCreating(true)
      const newWorkflow = await trpcClient.workflow.create.mutate()
      console.log(newWorkflow)
      await queryClient.invalidateQueries({
        queryKey: trpc.workflow.getMany.queryKey(),
      })
      if (newWorkflow?.id) {
        navigate({ to: `/workflow/${newWorkflow.id}` })
      }
    } catch (error) {
      console.error('Failed to create workflow:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading workflows...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create and Manage Workflows
          </h2>
          <p className="text-muted-foreground mt-1">
            Build and organize your automation workflows
          </p>
        </div>
        <Button
          onClick={handleCreateWorkflow}
          className="gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          {isCreating ? 'Creating...' : 'Create Workflow'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(workflows) &&
          workflows.map((workflow: any) => (
            <div
              key={workflow.id}
              className="rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors"
            >
              <h3 className="font-semibold">{workflow.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Created: {new Date(workflow.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>

      {(!Array.isArray(workflows) || workflows.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No workflows yet. Create your first workflow to get started.
          </p>
        </div>
      )}
    </div>
  )
}
