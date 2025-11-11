'use client'

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
  console.log(pathname)

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
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      'h-10 px-3  rounded-md transition-all duration-150 group relative',
                      'hover:bg-white/6 hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
                      'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ',
                    )}
                    isActive={
                      pathname === item.url || pathname.startsWith(item.url)
                    }
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="bg-transparent  group-data-[collapsible=icon]:hidden font-medium tracking-tight text-muted-foreground group-hover:text-foreground">
                        {item.title}
                      </span>
                      {item.badge && (
                        <SidebarMenuBadge className=" ml-auto bg-foreground/10 text-foreground font-medium px-2 py-[3px] rounded-full text-[10px] group-hover:scale-105 transition-transform">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
