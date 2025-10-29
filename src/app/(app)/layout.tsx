'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header/header'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AuthContext } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { BreadcrumbProvider, useBreadcrumb } from '@/contexts/BreadcumbContext'
import { appRoutesPathnames } from '@/components/app-routes-pathnames'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

function AppCrumbs() {
  const pathname = usePathname()
  const { tail } = useBreadcrumb()

  const currentGroup = appRoutesPathnames.find((group) =>
    group.items.some((item) => pathname.startsWith(item.path))
  )
  const currentItem = currentGroup?.items.find((item) =>
    pathname.startsWith(item.path)
  )

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-md">
        {/* Grupo */}
        {currentGroup && (
          <BreadcrumbItem className="rounded-lg border p-2 dark:border-muted">
            {currentGroup.groupLabel}
          </BreadcrumbItem>
        )}

        {/* Item base (LISTA) — agora é link para voltar */}
        {currentItem && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={currentItem.path}
                  className="flex items-center gap-2"
                >
                  {currentItem.icon && <currentItem.icon size={16} />}
                  {currentItem.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {tail && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {tail.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { isAuthenticate, isLoadingAuth } = useContext(AuthContext)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (isLoadingAuth) return
    if (isAuthenticate === false) {
      router.replace('/auth/sign-in')
    } else {
      setIsCheckingAuth(false)
    }
  }, [isAuthenticate, router, isLoadingAuth])

  if (isCheckingAuth) {
    return <></>
  }

  return (
    <div className="p-4">
      <SidebarProvider>
        <BreadcrumbProvider>
          <AppSidebar />
          <main className="flex w-full flex-col">
            <div className="mb-4 flex flex-col items-center gap-8">
              <div className="flex w-full items-center justify-between rounded-lg border p-4 shadow-lg dark:border-muted">
                <div className="flex items-center gap-8">
                  <SidebarTrigger />
                  <div className="flex gap-1">
                    <Separator orientation="vertical" className="h-10" />
                    <Separator orientation="vertical" className="h-10" />
                  </div>
                  <AppCrumbs />
                </div>
                <Header />
              </div>
            </div>

            {children}
          </main>
          <Toaster />
        </BreadcrumbProvider>
      </SidebarProvider>
    </div>
  )
}
