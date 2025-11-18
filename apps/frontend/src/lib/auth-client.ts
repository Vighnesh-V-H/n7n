import { createAuthClient } from 'better-auth/react'
import { polarClient } from '@polar-sh/better-auth'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8081',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [polarClient()],
})

export const { signIn, signUp, signOut, useSession, customer, checkout } =
  authClient

export type AuthClient = typeof authClient
