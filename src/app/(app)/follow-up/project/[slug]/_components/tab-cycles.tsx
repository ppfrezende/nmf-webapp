'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type Project } from '@/hooks/projects/use-projects'
import { Badge } from '@/components/ui/badge'
import { CreateCycleFormDialog } from './create-cycle-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { View } from 'lucide-react'

type TabCyclesProps = {
  data: Project
}

export default function TabCycles({ data }: TabCyclesProps) {
  return (
    <div className="mt-4 max-w-[1200px]">
      {data && (
        <>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.cycles.map((cycle) => (
              <Link
                key={cycle.id}
                href={`${data.id}/cycle/${cycle.id}`}
                passHref
              >
                <Card className="grid h-48 grid-rows-[auto,1fr,auto]">
                  <CardHeader className="min-h-[3.5rem] space-y-1">
                    <CardTitle className="line-clamp-2 flex items-center justify-between text-base font-semibold leading-tight">
                      {cycle.title}
                      <Button variant="outline" size="sm">
                        <View />
                      </Button>
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {cycle.notes}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Badge
                      className="justify-self-end"
                      variant={
                        cycle.status === 'PLANNING'
                          ? 'planning'
                          : cycle.status === 'IN_PROGRESS'
                            ? 'in_progress'
                            : cycle.status === 'ON_HOLD'
                              ? 'outline'
                              : cycle.status === 'DONE'
                                ? 'done'
                                : 'outline'
                      }
                    >
                      {cycle.status === 'PLANNING'
                        ? 'Planejando'
                        : cycle.status === 'IN_PROGRESS'
                          ? 'Em progresso'
                          : cycle.status === 'ON_HOLD'
                            ? 'Em espera'
                            : cycle.status === 'DONE'
                              ? 'Estudado'
                              : 'Erro'}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Card className="flex h-48 items-center justify-center">
              <CardContent>
                <CreateCycleFormDialog project={data} />
              </CardContent>
            </Card>
          </div>

          {/* <div className="mb-4 mt-8 flex items-start justify-between">
        <SearchBar />

        <CreateUserForm />
      </div>

      {!data ? (
        <div className="flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded">
          <UsersTable users={data.users} />
          <CustomPagination
            isSearch={!!debouncedSearchTerm}
            totalOfResults={data.totalPageCount}
            totalCountOfRegisters={data.totalCount}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )} */}
          {/* <CustomPagination
            // isSearch={!!debouncedSearchTerm}
            totalOfResults={data.total_count}
            totalCountOfRegisters={data.registersPerPage}
            currentPage={page}
            onPageChange={setPage}
          /> */}
        </>
      )}
    </div>
  )
}
