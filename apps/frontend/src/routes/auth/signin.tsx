import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth-form'
import { FullPageLoader } from '@/components/ui/loader'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/signin')({
  component: SignInPage,
  pendingComponent: FullPageLoader,
  loader: async () => {
    const session = await authClient.getSession()
    if (session.data?.user) {
      throw redirect({ to: '/dashboard' })
    }
    return { session }
  },
})

function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AuthForm isSignUp={false} />
    </div>
  )
}
