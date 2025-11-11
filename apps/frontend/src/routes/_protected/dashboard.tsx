import { createFileRoute, useRouter } from '@tanstack/react-router'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requireAuth } from '@/middleware/auth'
import { FullPageLoader } from '@/components/ui/loader'

export const Route = createFileRoute('/_protected/dashboard')({
  component: DashboardPage,
  pendingComponent: FullPageLoader,
  loader: async () => {
    return await requireAuth()
  },
})

function DashboardPage() {
  const loaderData = Route.useLoaderData()
  const router = useRouter()

  const { session } = loaderData

  const handleSignOut = async () => {
    await signOut()
    router.navigate({ to: '/auth/signin' })
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              You are now logged in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg text-foreground">{session.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg text-foreground">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                User ID
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                {session.user.id}
              </p>
            </div>
            {session.user.image && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Profile Image
                </p>
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-20 h-20 rounded-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>Current session details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Session ID
              </p>
              <p className="text-sm font-mono text-muted-foreground">
                {session.session.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Expires At
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(session.session.expiresAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
