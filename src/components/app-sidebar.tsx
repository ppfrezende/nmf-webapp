'use client'

import { LifeBuoy, Send } from 'lucide-react'

import logo from '../../public/logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { appRoutesPathnames } from './app-routes-pathnames'

const helpRoutes = [
  {
    title: 'Suppport',
    url: '#',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send,
  },
]

export function AppSidebar() {
  const { user } = useContext(AuthContext)
  const pathname = usePathname()

  const filteredGroupItems = appRoutesPathnames.filter((item) =>
    item.roles.includes(user!.role)
  )

  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2">
          <Image
            src={logo}
            alt="logo"
            className={`transition-all ${state === 'collapsed' ? 'h-6 w-6' : 'h-10 w-10'}`}
          />
        </div>
      </SidebarHeader>
      <SidebarSeparator className="m-2" />
      <SidebarContent>
        {filteredGroupItems.map((group) => (
          <SidebarGroup key={group.groupLabel}>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.path)
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        className={clsx(
                          'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2',
                          {
                            'bg-gray-200 font-semibold text-primary dark:bg-green-600':
                              isActive,
                            'hover:bg-gray-100 dark:hover:bg-gray-800':
                              !isActive,
                          }
                        )}
                        asChild
                      >
                        <a href={item.path}>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarSeparator className="m-2" />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpRoutes.map((route) => (
                <SidebarMenuItem key={route.title}>
                  <SidebarMenuButton asChild className="ml-[-8px]">
                    <a href={route.url}>
                      <route.icon />
                      <span>{route.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state === 'collapsed' ? (
          <></>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="text-left text-[10px] text-muted-foreground">
                    <p>
                      <span>
                        &copy; {new Date().getFullYear()} No-More-Failures
                      </span>
                    </p>
                    <p>
                      <span>Todos os direitos reservados.</span>
                    </p>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
