import { createServerFn } from '@tanstack/react-start'
import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { requireAuth } from '@/middleware/auth'
import { FullPageLoader } from '@/components/ui/loader'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { sidebarConfig } from '@/config/sidebar'
import { useTRPC } from '@/integrations/trpc/react'

const checkauth = createServerFn().handler(async () => {
  await requireAuth()
})

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
  pendingComponent: FullPageLoader,
  loader: () => checkauth,
})

function ProtectedLayout() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname || '/'
  const trpc = useTRPC()

  const healthQuery = useQuery(trpc.health.check.queryOptions())

  console.log(healthQuery.data)

  const currentRoute = sidebarConfig
    .flatMap((section) => section.items)
    .find(
      (item) => pathname === item.url || pathname.startsWith(item.url + '/'),
    )

  const routeName = currentRoute?.title || 'Dashboard'

  return (
    <TooltipProvider>
      <div className="h-screen flex overflow-hidden">
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset className="flex flex-col w-full">
            <header className="flex h-16 bg-[#1e1e1e4e] shrink-0 border-b border-border/40 justify-between items-center gap-2 px-4">
              <div className="flex items-center gap-2 px-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1 md:hidden" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle sidebar</p>
                  </TooltipContent>
                </Tooltip>

                <Separator
                  orientation="vertical"
                  className="mr-2 bg-border h-4"
                />

                <h1 className="text-lg font-semibold">{routeName}</h1>
              </div>

              <div className="hidden md:flex items-center gap-3 mr-4">
                {healthQuery.data && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-xs">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">
                          {healthQuery.data.status}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Last checked:{' '}
                        {new Date(
                          healthQuery.data.timestamp,
                        ).toLocaleTimeString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full" />
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6 dark:bg-background">
              <Outlet />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  )
}
