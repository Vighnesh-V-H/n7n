import { createFileRoute } from '@tanstack/react-router'
import { FullPageLoader } from '@/components/ui/loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_protected/dashboard')({
  component: Dashboard,
  pendingComponent: FullPageLoader,
})

function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your account.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Projects</CardTitle>
                <CardDescription>Active projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Active users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New project created</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Task completed</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team member invited</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
