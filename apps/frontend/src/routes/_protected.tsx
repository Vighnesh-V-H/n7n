import { createServerFn } from '@tanstack/react-start'
import { Outlet, createFileRoute } from '@tanstack/react-router'
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

const checkauth = createServerFn().handler(async () => {
  await requireAuth()
})

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
  pendingComponent: FullPageLoader,
  loader: () => checkauth,
})

function ProtectedLayout() {
  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="flex flex-col w-full">
          <header className="flex h-16 shrink-0 border-b border-border/40 justify-between items-center gap-2 px-4">
            <div className="flex items-center gap-2 px-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1 md:hidden" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator
                orientation="vertical"
                className="mr-2 bg-border h-4"
              />
            </div>
            <div className="hidden md:flex items-center gap-3 mr-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 dark:bg-background">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
