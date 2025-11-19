import {
  BarChart3,
  FolderKanban,
  LogOut,
  Settings,
  User,
  Workflow,
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
        title: 'Workflows',
        url: '/workflow',
        icon: Workflow,
      },
      {
        title: 'Analytics',
        url: '/analytics',
        icon: BarChart3,
      },
      {
        title: 'Projects',
        url: '/projects',
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
        url: '/settings',
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
