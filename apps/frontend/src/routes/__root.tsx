import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'

import { AlertCircle, Home } from 'lucide-react'
import Header from '../components/header-landing'
import { Button } from '../components/ui/button'

import appCss from '../styles.css?url'

import type { AppRouter } from '@n7n/backend/trpc'
import type { QueryClient } from '@tanstack/react-query'

import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { ThemeProvider } from '@/components/theme-provider'

interface RouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<AppRouter>
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

  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-2">
          404 - Page Not Found
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Button asChild size="lg" className="gap-2">
          <Link to="/workflows">
            <Home className="h-4 w-4" />
            Back to Workflows
          </Link>
        </Button>
      </div>
    </div>
  )
}

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
