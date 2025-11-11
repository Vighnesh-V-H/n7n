import { redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export async function requireAuth() {
  try {
    const session = await authClient.getSession()

    if (!session.data?.user) {
      throw redirect({
        to: '/auth/signin'
      })
    }

    return { session: session.data }
  } catch (error) {
    if (error && typeof error === 'object' && 'isRedirect' in error) {
      throw error
    }

    console.error('Auth check failed:', error)
    throw redirect({
      to: '/auth/signin',
      search: {
        error: 'session_error',
      },
    })
  }
}
