import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTRPC } from '@/integrations/trpc/react'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'

export function Workflows() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null)

  const { data: workflows, isLoading } = useQuery(
    trpc.workflow.getMany.queryOptions(),
  )

  const handleCreateWorkflow = async () => {
    try {
      setIsCreating(true)
      const newWorkflow = await trpcClient.workflow.create.mutate()

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

  const handleWorkflowClick = (workflowId: string) => {
    navigate({ to: `/workflow/${workflowId}` })
  }

  const handleDeleteWorkflow = async (
    workflowId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    setWorkflowToDelete(workflowId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteWorkflow = async () => {
    if (!workflowToDelete) return

    try {
      await trpcClient.workflow.remove.mutate({ id: workflowToDelete })
      await queryClient.invalidateQueries({
        queryKey: trpc.workflow.getMany.queryKey(),
      })
      setDeleteDialogOpen(false)
      setWorkflowToDelete(null)
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  const handleStartEdit = (
    workflowId: string,
    currentName: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    setEditingId(workflowId)
    setEditingName(currentName)
  }

  const handleSaveEdit = async (workflowId: string, e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!editingName.trim()) return

    try {
      await trpcClient.workflow.updateName.mutate({
        id: workflowId,
        name: editingName.trim(),
      })
      await queryClient.invalidateQueries({
        queryKey: trpc.workflow.getMany.queryKey(),
      })
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      console.error('Failed to update workflow name:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
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
              className="rounded-lg border bg-card p-6 hover:bg-accent/50 transition-colors cursor-pointer relative"
              onClick={() => handleWorkflowClick(workflow.id)}
            >
              <div className="flex items-start justify-between gap-2">
                {editingId === workflow.id ? (
                  <form
                    onSubmit={(e) => handleSaveEdit(workflow.id, e)}
                    className="flex-1"
                  >
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={handleCancelEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="h-8 font-semibold"
                      autoFocus
                    />
                  </form>
                ) : (
                  <h3 className="font-semibold flex-1">{workflow.name}</h3>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) =>
                        handleStartEdit(workflow.id, workflow.name, e)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteWorkflow}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
