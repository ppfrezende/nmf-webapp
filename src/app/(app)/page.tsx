'use client'

import { useContext, useEffect } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'ADMIN':
          router.replace('/follow-up')
          break
        case 'MEMBER':
          router.replace('/follow-up')
          break
        default:
          router.replace('/auth/sign-in')
      }
    } else {
      router.replace('/auth/sign-in')
    }
  }, [router, user])

  return <></>
}
