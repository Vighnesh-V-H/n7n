import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'

import Header from '../components/header'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { ThemeProvider } from '@/components/theme-provider'

interface RouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'N7N',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState()
  const isAuthRoute = routerState.location.pathname.startsWith('/auth')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <ThemeProvider defaultTheme="dark">
        <body>
          {isAuthRoute && <Header />}
          {children}
          <Scripts />
        </body>
      </ThemeProvider>
    </html>
  )
}
