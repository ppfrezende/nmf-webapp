'use client'

import { withRoleProtection } from '@/hoc'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getProjects,
  type GetProjectsResponse,
} from '@/hooks/projects/use-projects'
import { CreateProjectFormDialog } from './create-project-form'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

function FollowUpPage() {
  const [page] = useState(1)

  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(page),
  }) as UseQueryResult<GetProjectsResponse, unknown>

  return (
    <div>
      {data && (
        <>
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-gray-50 p-4 shadow-lg dark:border-muted dark:bg-muted">
            <h1 className=" text-2xl font-black">
              🎉 Bem-vindo ao seu espaço de estudos, BORA PRA CIMAAA!
            </h1>
            <div className="flex max-w-[70%] flex-col items-center justify-center gap-2 text-center text-sm">
              <span>
                O motivo de você estar aqui é porque{' '}
                <strong>TOMOU VERGONHA NA CARA</strong> e decidiu, através dos
                estudos, dar um rumo na vida.
              </span>
              <span>
                Aqui você pode <strong>criar e organizar</strong> seus editais,
                transformar cada disciplina em etapas claras e
                <strong> acompanhar seu progresso de perto.</strong>
              </span>{' '}
              <span>
                Dê o primeiro passo agora mesmo: crie um novo projeto e comece a
                trilhar sua jornada
                <strong className="text-green-700">
                  {' '}
                  rumo à aprovação. 🚀
                </strong>
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {data.projects.map((project) => (
              <Link
                key={project.id}
                href={`follow-up/project/${project.id}`}
                passHref
              >
                <Card className="grid h-48 grid-rows-[auto,1fr,auto]">
                  <CardHeader className="min-h-[3.5rem] space-y-1">
                    <CardTitle className="line-clamp-2 text-base font-semibold leading-tight">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {project.board}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Badge
                      className="justify-self-end"
                      variant={
                        project.status === 'PLANNING'
                          ? 'planning'
                          : project.status === 'IN_PROGRESS'
                            ? 'in_progress'
                            : project.status === 'ON_HOLD'
                              ? 'outline'
                              : project.status === 'DONE'
                                ? 'done'
                                : 'outline'
                      }
                    >
                      {project.status === 'PLANNING'
                        ? 'Planejando'
                        : project.status === 'IN_PROGRESS'
                          ? 'Em progresso'
                          : project.status === 'ON_HOLD'
                            ? 'Em espera'
                            : project.status === 'DONE'
                              ? 'Estudado'
                              : 'Erro'}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Card className="flex h-48 items-center justify-center">
              <CardContent>
                <CreateProjectFormDialog />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default withRoleProtection(FollowUpPage)
