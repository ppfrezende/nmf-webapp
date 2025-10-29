'use client'

import { ReactNode, createContext, useEffect, useState } from 'react'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api-client'
import { AxiosError } from 'axios'

type User = {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  created_at: string
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  user: User | null
  isAuthenticate: boolean
  isLoadingAuth: boolean
  isInvalidCredentials: boolean
  setIsInvalidCredentials: (value: boolean) => void
  isServerConnectionRefused: boolean
  setIsServerConnectionRefused: (value: boolean) => void
  signOut: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)
let authChannel: BroadcastChannel

export function signOut(byBroadcastChannel = false) {
  destroyCookie(undefined, 'nmf.token', { path: '/' })
  destroyCookie(undefined, 'nmf.refreshToken', { path: '/' })

  if (!byBroadcastChannel) {
    authChannel.postMessage('signOut')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  const [isInvalidCredentials, setIsInvalidCredentials] =
    useState<boolean>(false)
  const [isServerConnectionRefused, setIsServerConnectionRefused] =
    useState<boolean>(false)

  const router = useRouter()
  const { 'nmf.token': token } = parseCookies()

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut(true)
          break

        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    if (token) {
      api
        .get('/me')
        .then((response) => {
          setUser(response.data.user)
          setIsAuthenticate(true)
        })
        .catch(() => {
          signOut()
          router.push('/auth/sign-in')
        })
        .finally(() => {
          setIsLoadingAuth(false)
        })
    } else {
      setIsLoadingAuth(false)
    }
  }, [router, token])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      })

      const { token, refreshToken, id, name, role, isActive, created_at } =
        response.data

      setCookie(undefined, 'nmf.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      setCookie(undefined, 'nmf.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      setUser({
        id,
        name,
        email,
        role,
        isActive,
        created_at,
      })

      api.defaults.headers.Authorization = `Bearer ${token}`

      authChannel.postMessage('signIn')

      router.push('/')
    } catch (err) {
      if (err instanceof AxiosError) {
        const isInvalidCredentials =
          err.response?.data.message === 'Invalid credentials.'
        const isServerConnectionRefused = err.message === 'Network Error'

        if (isInvalidCredentials) {
          setIsInvalidCredentials(true)
        }
        if (isServerConnectionRefused) {
          setIsServerConnectionRefused(true)
        }
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticate,
        isLoadingAuth,
        user,
        isInvalidCredentials,
        isServerConnectionRefused,
        setIsServerConnectionRefused,
        setIsInvalidCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
