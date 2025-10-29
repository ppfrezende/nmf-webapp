'use client'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/contexts/BreadcumbContext'

export function BreadcrumbTail({
  label,
  href,
}: {
  label: string
  href?: string
}) {
  const { setTail } = useBreadcrumb()
  useEffect(() => {
    setTail({ label, href })
    return () => setTail(null)
  }, [label, href, setTail])
  return null
}
