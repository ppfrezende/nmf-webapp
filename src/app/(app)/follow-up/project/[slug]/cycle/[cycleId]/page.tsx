'use client'

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { ChevronsLeft, Timer } from 'lucide-react'
import {
  getCycle,
  getProject,
  type Cycle,
  type Project,
} from '@/hooks/projects/use-projects'
import { withRoleProtection } from '@/hoc'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CycleDetailsDialogForm } from './cycle-details-dialog-form'
import { CycleNotesDialogForm } from './cycle-notes-dialog-form'
import {
  getStudiedTopicsByCycle,
  type GetStudiedTopicsByCycleResponse,
} from '@/hooks/projects/use-studied-topics'
import { UnstudiedTopicsTable } from './unstudied-topics-table'
import { useMemo } from 'react'
import { formatSecondsToHhMm } from '@/lib/utils'
import ColoredProgress from '@/components/ui/colored-progress'
import { Separator } from '@/components/ui/separator'
import { DeleteCycleDialog } from './delete-cycle-dialog'
import { CreateStudySessionFormDialog } from './create-study-session-dialog-form'
import { StudiedTopicsTable } from './studied-topics-table'
import { PerformanceBadge } from '@/components/ui/performance-percentage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getDisciplinesStatsByCycle,
  type DisciplinesStats,
} from '@/hooks/projects/use-disciplines'
import { DisciplinesStatsTable } from './disciplines-stats-by-cycle-table'
import { BreadcrumbTail } from '@/components/ui/breadcumb-tail'
import { Button } from '@/components/ui/button'

function CyclePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'session-stats'
  const handleTabChange = (tab: string) => {
    router.push(`${pathname}?tab=${tab}`, { scroll: false })
  }

  const { cycleId, slug } = useParams()
  const safeSlug = Array.isArray(slug) ? slug[0] : slug
  const safeCycleId = Array.isArray(cycleId) ? cycleId[0] : cycleId

  const { data } = useQuery({
    queryKey: ['cycles', cycleId, slug],
    queryFn: () =>
      safeCycleId && safeSlug
        ? getCycle(safeCycleId, safeSlug)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<Cycle, unknown>

  const { data: projectData } = useQuery({
    queryKey: ['projects', slug],
    queryFn: () =>
      safeSlug
        ? getProject(safeSlug)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<Project, unknown>

  const { data: studiedTopicsData } = useQuery({
    queryKey: ['studied-topics', cycleId, slug],
    queryFn: () =>
      safeCycleId && safeSlug
        ? getStudiedTopicsByCycle(safeSlug, safeCycleId)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<GetStudiedTopicsByCycleResponse, unknown>

  const { data: disciplinesStatsData } = useQuery({
    queryKey: ['discipline-stats', cycleId, slug],
    queryFn: () =>
      safeCycleId && safeSlug
        ? getDisciplinesStatsByCycle(safeSlug, safeCycleId)
        : Promise.reject(new Error('Invalid or undefined slug')),
  }) as UseQueryResult<DisciplinesStats[], unknown>

  const summary = useMemo(() => {
    const studied = studiedTopicsData?.studiedTopics ?? []
    const unstudied = studiedTopicsData?.unstudiedTopics ?? []

    let eachPerformancePercentage = 0
    let totalStudingDurationSec = 0

    for (const topic of studied) {
      for (const s of topic.study_sessions ?? []) {
        eachPerformancePercentage += Number(s.performancePercentage) ?? 0
        totalStudingDurationSec += s.totalStudingDurationSec ?? 0
      }
    }

    const performancePercentage = eachPerformancePercentage / studied.length

    const totalTopics = studied.length + unstudied.length

    return {
      totalStudied: studied.length,
      totalTopics,
      performancePercentage,
      totalStudingDurationSec,
    }
  }, [studiedTopicsData])

  return (
    <>
      {data && projectData && (
        <div className="mt-6">
          <BreadcrumbTail label={projectData.title} />
          <Button
            onClick={() => router.push(`/follow-up/project/${slug}?tab=cycles`)}
            variant="outline"
            className="mb-4"
          >
            <ChevronsLeft /> voltar
          </Button>

          <div className="mb-4 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="grid grid-rows-[auto,1fr,auto]">
              <CardHeader className="space-y-1">
                <CardDescription className="flex items-center justify-between">
                  DETALHES
                  <div className="flex gap-2">
                    <CycleDetailsDialogForm cycle={data} />
                    <DeleteCycleDialog
                      projectId={data.projectId}
                      cycleId={data.id}
                    />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Badge
                    className="justify-self-end"
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
            </Card>
            <Card className="grid grid-rows-[auto,1fr,auto]">
              <CardHeader className="space-y-1">
                <CardDescription>DESEMPENHO DO CICLO</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end justify-end">
                <PerformanceBadge value={summary.performancePercentage} />
              </CardContent>
            </Card>

            <Card className="grid grid-rows-[auto,1fr,auto]">
              <CardHeader className="space-y-1">
                <CardDescription>TÓPICOS ESTUDADOS</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <div>
                  <Badge variant="done">{summary.totalStudied}</Badge>/
                  <Badge variant="in_progress">{summary.totalTopics}</Badge>
                </div>
                <ColoredProgress
                  value={(summary.totalStudied / summary.totalTopics) * 100}
                />
              </CardContent>
            </Card>
            <Card className="grid grid-rows-[auto,1fr,auto]">
              <CardHeader className="space-y-1">
                <CardDescription>TEMPO GERAL DE ESTUDO</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <Timer />
                <h1 className="text-2xl font-medium">
                  {formatSecondsToHhMm(summary.totalStudingDurationSec)}
                </h1>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <CardDescription className="flex items-center justify-between">
                NOTAS 🗒️ <CycleNotesDialogForm cycle={data} />
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {data.notes?.length === 0 ? (
                <h1 className="text-xs font-light italic">
                  Nenhuma observação ainda
                </h1>
              ) : (
                data.notes && (
                  <h1 className="text-xs font-light">{data.notes}</h1>
                )
              )}
            </CardContent>
          </Card>

          <Separator className="mb-4" />

          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="session-stats">Status Tópicos</TabsTrigger>
              <TabsTrigger value="discipline-stats">
                Status Disciplinas
              </TabsTrigger>
            </TabsList>
            <Separator className="my-4" />
            <TabsContent value="session-stats">
              <div className="flex flex-col gap-2">
                {projectData && (
                  <div className="pb-4">
                    <CreateStudySessionFormDialog
                      cycle={data}
                      project={projectData}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-green-50 p-4 shadow-lg dark:border-muted dark:bg-transparent">
                  <Badge variant="done">estudados</Badge>
                  {studiedTopicsData && projectData && (
                    <StudiedTopicsTable
                      data={studiedTopicsData.studiedTopics}
                      projectId={projectData.id}
                    />
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 rounded-2xl border bg-green-50 p-4 shadow-lg dark:border-muted dark:bg-transparent">
                  <Badge variant="in_progress">ainda falta</Badge>
                  {studiedTopicsData && (
                    <UnstudiedTopicsTable
                      data={studiedTopicsData.unstudiedTopics}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="discipline-stats">
              <div className="flex flex-col items-center gap-2 rounded-2xl border bg-green-50 p-4 shadow-lg dark:border-muted dark:bg-transparent">
                {disciplinesStatsData && (
                  <DisciplinesStatsTable
                    disciplinesStatsData={disciplinesStatsData}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  )
}

export default withRoleProtection(CyclePage)
