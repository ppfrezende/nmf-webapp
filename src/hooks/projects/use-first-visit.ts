// hooks/use-first-visit.ts
'use client'

import { useEffect, useMemo, useState } from 'react'

type Opts = {
  id: string // identificador único: ex. pathname
  version?: number // se mudar o conteúdo, incremente p/ mostrar de novo
  ttlDays?: number // opcional: expirar após N dias
}

export function useFirstVisit({ id, version = 1, ttlDays }: Opts) {
  const key = useMemo(() => `nmf:firstvisit:${id}:v${version}`, [id, version])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(key)

    if (!raw) {
      // nunca visto
      setOpen(true)
      return
    }

    if (ttlDays) {
      try {
        const { ts } = JSON.parse(raw) as { ts: number }
        const ms = ttlDays * 24 * 60 * 60 * 1000
        if (Date.now() - ts > ms) setOpen(true)
      } catch {
        setOpen(true)
      }
    }
  }, [key, ttlDays])

  const markSeen = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify({ ts: Date.now() }))
  }

  const reset = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
    setOpen(true)
  }

  return { open, setOpen, markSeen, reset }
}
