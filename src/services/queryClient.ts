import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // suspense: true,
      staleTime: 20 * (60 * 1000),
    },
  },
})
