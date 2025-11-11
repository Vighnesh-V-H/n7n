import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react'

export interface SidebarItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

export interface SidebarSection {
  title: string
  items: Array<SidebarItem>
}

export const sidebarConfig: Array<SidebarSection> = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        url: '/dashboard',
        icon: BarChart3,
      },
      {
        title: 'Projects',
        url: '/dashboard',
        icon: FolderKanban,
        badge: '3',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings',
        url: '/dashboard',
        icon: Settings,
      },
    ],
  },
]

export const accountMenuItems = [
  {
    title: 'Account',
    icon: User,
  },
  {
    title: 'Settings',
    icon: Settings,
  },
  {
    title: 'Logout',
    icon: LogOut,
  },
]
