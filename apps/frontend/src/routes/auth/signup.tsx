import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth-form'
import { requireGuest } from '@/middleware/auth'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
  beforeLoad: async () => {
    await requireGuest()
  },
})

function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AuthForm isSignUp={true} />
    </div>
  )
}
