import { Link } from '@tanstack/react-router'
import { Key,Lock, Shield,  UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AuthFeatureCard() {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-cyan-400" />
          <CardTitle className="text-xl text-white">
            Authentication Ready
          </CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Complete auth system with Better Auth, tRPC, and PostgreSQL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-cyan-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-white">Email/Password</p>
              <p className="text-xs text-gray-400">Secure authentication</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Key className="w-4 h-4 text-cyan-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-white">OAuth Ready</p>
              <p className="text-xs text-gray-400">Google integration</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-white">Session Management</p>
              <p className="text-xs text-gray-400">Cookie-based auth</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-cyan-400 mt-1" />
            <div>
              <p className="text-sm font-medium text-white">Type Safety</p>
              <p className="text-xs text-gray-400">End-to-end types</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Link to="/login" className="flex-1">
            <Button variant="default" className="w-full" size="sm">
              Try Login
            </Button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
