import { useRouter } from '@tanstack/react-router'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { signOut, useSession } from '@/lib/auth-client'

export function NavUser() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const handleSignout = async () => {
    await signOut()
    router.navigate({ to: '/auth/signin' })
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-muted/60 data-[state=open]:bg-muted/70"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.image || ''}
                  alt={user?.name || 'User'}
                />
                <AvatarFallback className="rounded-lg bg-muted">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email || ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-1"
            side="top"
            align="end"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-1.5 text-left text-[13px]">
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarImage
                    src={user?.image || ''}
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback className="rounded-lg bg-muted">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || ''}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel> */}

            <DropdownMenuGroup className="mt-1 space-y-0.5">
              <DropdownMenuItem className="text-[13px] py-1.5">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Upgrade to Pro
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] py-1.5">
                <BadgeCheck className="mr-2 h-3.5 w-3.5" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] py-1.5">
                <CreditCard className="mr-2 h-3.5 w-3.5" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] py-1.5">
                <Bell className="mr-2 h-3.5 w-3.5" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[13px] py-1.5 cursor-pointer text-red-500 focus:text-red-500"
                onClick={handleSignout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
