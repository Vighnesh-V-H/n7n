import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/404')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">
          404 - Page Not Found
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button asChild size="lg" className="gap-2">
          <Link to="/workflows">
            <Home className="h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>
    </div>
  )
}
