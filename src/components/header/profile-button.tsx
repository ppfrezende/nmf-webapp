'use client'

import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ChevronDown, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import getInitialsName from '@/lib/getInitialsName'
import Link from 'next/link'

export function ProfileButton() {
  const { signOut, user } = useContext(AuthContext)
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            👋&nbsp; {` Olá, ${user?.name}`}
          </span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
        <Avatar>
          {user?.name && (
            <AvatarFallback>{getInitialsName(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel></DropdownMenuLabel> */}
        <DropdownMenuItem>
          <Link href={`/admin/users/${user?.id}`}>Minha Conta</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant="ghost"
            onClick={() => {
              signOut()
              router.push('/auth/sign-in')
            }}
          >
            <LogOut className="mr-2 size-4" />
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
