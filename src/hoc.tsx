'use client'
import { useEffect, useContext, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { AuthContext } from '@/contexts/AuthContext'
import { LoaderIcon } from 'lucide-react'

const roleRoutes: Record<string, string[]> = {
  ADMIN: ['/follow-up'],
  MEMBER: ['/follow-up'],
}

export function withRoleProtection<T extends object>(Component: React.FC<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function ProtectedRoute(props: any) {
    const [isCheckingPermission, setIsCheckingPermission] = useState(true)
    const { user } = useContext(AuthContext)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
      if (!user) {
        router.replace('/auth/sign-in')
        return
      }

      if (user.role === 'ADMIN') {
        setIsCheckingPermission(false)
        return
      }

      const allowedRoutes = roleRoutes[user.role] || []

      if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
        router.replace(allowedRoutes[0] || '/auth/sign-in')
      }
      setIsCheckingPermission(false)
    }, [user, pathname, router])

    if (isCheckingPermission) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <LoaderIcon className="animate-spin" />s
        </div>
      )
    }

    return <Component {...props} />
  }
}
