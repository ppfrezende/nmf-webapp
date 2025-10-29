'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { QueryClientProvider } from '@tanstack/react-query'
// import { SearchProvider } from '@/contexts/SearchContext'
// import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/services/queryClient'

import { ThemeProvider } from 'next-themes'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { AuthProvider } from './AuthContext'

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {/* <SearchProvider> */}
          <AuthProvider>{children}</AuthProvider>
          {/* </SearchProvider> */}
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  )
}
