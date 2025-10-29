'use client'
import { createContext, useContext, useMemo, useState } from 'react'

type Tail = { label: string; href?: string } | null

type Ctx = {
  tail: Tail
  setTail: (t: Tail) => void
}

const BreadcrumbCtx = createContext<Ctx | null>(null)

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [tail, setTail] = useState<Tail>(null)
  const value = useMemo(() => ({ tail, setTail }), [tail])
  return (
    <BreadcrumbCtx.Provider value={value}>{children}</BreadcrumbCtx.Provider>
  )
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbCtx)
  if (!ctx)
    throw new Error('useBreadcrumb must be used inside BreadcrumbProvider')
  return ctx
}
