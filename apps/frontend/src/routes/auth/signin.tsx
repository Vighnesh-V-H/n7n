import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth-form'
import { requireGuest } from '@/middleware/auth'

export const Route = createFileRoute('/auth/signin')({
  component: SignInPage,
  beforeLoad: async () => {
    await requireGuest()
  },
})

function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AuthForm isSignUp={false} />
    </div>
  )
}
