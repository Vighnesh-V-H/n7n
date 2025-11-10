import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import type { TRPCRouter } from '@/integrations/trpc/router'

import { TRPCProvider } from '@/integrations/trpc/react'
import { axiosInstance } from '@/lib/axios'

function getUrl() {
  // Always use the backend server URL for tRPC
  return 'http://localhost:8081/api/v1'
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
      headers() {
        return {
          'Content-Type': 'application/json',
        }
      },
      async fetch(url: RequestInfo | URL, options?: RequestInit) {
        // Use axios for all tRPC requests to maintain consistency
        const response = await axiosInstance({
          url: url.toString(),
          method: options?.method || 'POST',
          data: options?.body,
          headers: {
            ...(options?.headers as Record<string, string>),
          },
        })
        
        return new Response(JSON.stringify(response.data), {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers({
            'content-type': 'application/json',
          }),
        })
      },
    }),
  ],
})

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  })

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  })
  return {
    queryClient,
    trpc: serverHelpers,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  )
}
