import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { sidebarConfig } from '@/config/sidebar'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function SidebarOptions() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname || '/'

  return (
    <>
      {sidebarConfig.map((section, index) => (
        <SidebarGroup
          key={section.title}
          className={cn('space-y-2', index > 0 && 'mt-8')}
        >
          <SidebarGroupLabel className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.12em] mb-2 px-3 group-data-[collapsible=icon]:hidden">
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.url === '/'
                    ? pathname === '/'
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        isActive && 'bg-white/10 text-white font-semibold',
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                        {item.badge && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
