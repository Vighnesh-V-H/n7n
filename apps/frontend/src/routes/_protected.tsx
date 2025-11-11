import { Outlet , createFileRoute,  } from '@tanstack/react-router'
import { requireAuth } from '@/middleware/auth'
import { FullPageLoader } from '@/components/ui/loader'

export const Route = createFileRoute('/_protected')({
  component: ProtectedLayout,
  pendingComponent: FullPageLoader,
  loader: async () => {
    return await requireAuth()
  },
})

function ProtectedLayout() {
  return <Outlet />
}
