import { LayoutDashboardIcon, NotebookPen, UserCog } from 'lucide-react'

export const appRoutesPathnames = [
  {
    groupLabel: 'Admin',
    roles: ['ADMIN'],
    items: [
      {
        label: 'Painel Admin',
        path: '/admin/panel-admin',
        icon: LayoutDashboardIcon,
      },
      { label: 'Usuários', path: '/admin/users', icon: UserCog },
    ],
  },
  {
    groupLabel: 'Estudos',
    roles: ['MEMBER', 'ADMIN'],
    items: [
      {
        label: 'Projetos',
        path: '/follow-up',
        icon: NotebookPen,
      },
    ],
  },
]
