import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AuthForm } from '@/components/auth-form'
import { FullPageLoader } from '@/components/ui/loader'

import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
  pendingComponent: FullPageLoader,
})

function SignUpPage() {
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (session?.user) {
      navigate({ to: '/workflows' })
    }
  }, [session, navigate])

  if (isPending) {
    return <FullPageLoader />
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <AuthForm isSignUp={true} />
    </div>
  )
}
