import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth-form'
import { FullPageLoader } from '@/components/ui/loader'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
  pendingComponent: FullPageLoader,
  loader: async () => {
    const session = await authClient.getSession()
    if (session.data?.user) {
      throw redirect({ to: '/dashboard' })
    }
    return { session }
  },
})

function SignUpPage() {
  const { session } = Route.useLoaderData()
  console.log(session)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AuthForm isSignUp={true} />
    </div>
  )
}
