import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'

export function ProtectedHeader() {
  const { isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4  border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        {isMobile && (
          <>
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M3 12h18"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-semibold">N7N</span>
            </div>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
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
  )
}
