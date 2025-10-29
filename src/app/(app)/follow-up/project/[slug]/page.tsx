'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { withRoleProtection } from '@/hoc'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  getProject,
  getTotalProjectStats,
  type Project,
  type TotalProjectStats,
} from '@/hooks/projects/use-projects'
import DisciplinesTable from './_components/disciplines-table'
import ProjectDetailsDialog from './project-details-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TabCycles from './_components/tab-cycles'
import { DeleteProjectDialog } from './delete-project-dialog'
import {
  getTotalDisciplinesStats,
  type TotalDisciplinesStats,
} from '@/hooks/projects/use-disciplines'
import { DisciplinesChartStats } from './_components/disciplines-chart-stats'
import { ProjectStatsTable } from './_components/project-stats-table'
import { PerformanceBadge } from '@/components/ui/performance-percentage'
import { BreadcrumbTail } from '@/components/ui/breadcumb-tail'

function ProjectPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'general'

  const handleTabChange = (tab: string) => {
    router.push(`${pathname}?tab=${tab}`, { scroll: false })
  }

  const { slug } = useParams()
  const safeSlug = Array.isArray(slug) ? slug[0] : slug

  const { data, isPending } = useQuery({
    queryKey: ['projects', slug],
    queryFn: () =>
      safeSlug
        ? getProject(safeSlug)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<Project, unknown>

  const { data: totalDisciplinesStatsData } = useQuery({
    queryKey: ['total-discipline-stats', slug],
    queryFn: () =>
      safeSlug
        ? getTotalDisciplinesStats(safeSlug)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<TotalDisciplinesStats[], unknown>

  const { data: totalProjectStatsData } = useQuery({
    queryKey: ['total-project-stats', slug],
    queryFn: () =>
      safeSlug
        ? getTotalProjectStats(safeSlug)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<TotalProjectStats, unknown>

  return (
    <>
      {data && (
        <div className="mt-6 ">
          <BreadcrumbTail label={data.title} />
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="general">Panorama Geral</TabsTrigger>
              <TabsTrigger value="cycles">Ciclos</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <div className="mb-4 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-10">
                <Card className="col-span-1 grid grid-rows-[auto,1fr,auto] md:col-span-2">
                  <CardHeader className="space-y-1">
                    <CardDescription className="flex items-center justify-between">
                      INFORMAÇÕES GERAIS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 items-center">
                      <span className="justify-self-start text-xs">Banca:</span>
                      <span className="justify-self-center font-medium">
                        {data.board}
                      </span>
                      <span className="justify-self-start text-xs">
                        Status:
                      </span>
                      <Badge
                        className="justify-self-center"
                        variant={
                          data.status === 'PLANNING'
                            ? 'planning'
                            : data.status === 'IN_PROGRESS'
                              ? 'in_progress'
                              : data.status === 'ON_HOLD'
                                ? 'outline'
                                : data.status === 'DONE'
                                  ? 'done'
                                  : 'outline'
                        }
                      >
                        {data.status === 'PLANNING'
                          ? 'Planejando'
                          : data.status === 'IN_PROGRESS'
                            ? 'Em progresso'
                            : data.status === 'ON_HOLD'
                              ? 'Em espera'
                              : data.status === 'DONE'
                                ? 'Estudado'
                                : 'Erro'}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <ProjectDetailsDialog data={data} />
                    <DeleteProjectDialog projectId={data.id} />
                  </CardFooter>
                </Card>

                <Card className="col-span-1 grid grid-rows-[auto,1fr,auto] md:col-span-2">
                  <CardHeader className="space-y-1">
                    <CardDescription>DESEMPENHO GERAL</CardDescription>
                  </CardHeader>
                  <CardContent className="flex">
                    {totalProjectStatsData && (
                      <ProjectStatsTable projectStats={totalProjectStatsData} />
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-center">
                    {totalProjectStatsData && (
                      <PerformanceBadge
                        value={totalProjectStatsData.performancePercentage}
                      />
                    )}
                  </CardFooter>
                </Card>

                <div className="col-span-1 md:col-span-6">
                  {totalDisciplinesStatsData && (
                    <DisciplinesChartStats
                      disciplines={totalDisciplinesStatsData}
                    />
                  )}
                </div>
              </div>

              {totalDisciplinesStatsData && (
                <DisciplinesTable
                  disciplines={totalDisciplinesStatsData}
                  projectId={data.id}
                  isPending={isPending}
                />
              )}
            </TabsContent>
            <TabsContent value="cycles">
              <TabCycles data={data} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  )
}

export default withRoleProtection(ProjectPage)
