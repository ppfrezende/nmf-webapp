'use client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { TopicRow, UiTopic } from '@/hooks/projects/use-studied-topics'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  FileStack,
  Percent,
  Timer,
  View,
  X,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { PerformanceBadge } from '@/components/ui/performance-percentage'
import { DeleteStudySessionDialog } from './delete-study-session-dialog'

function toRow(topic: UiTopic): TopicRow {
  const pagesReaded = topic.study_sessions.reduce(
    (sum, s) => sum + (s.pagesReaded ?? 0),
    0
  )

  const scanningReadingDurationSec = topic.study_sessions.reduce(
    (sum, s) => sum + (s.scanningReadingDurationSec ?? 0),
    0
  )
  const skimmingReadingDurationSec = topic.study_sessions.reduce(
    (sum, s) => sum + (s.skimmingReadingDurationSec ?? 0),
    0
  )

  const theoryStatus =
    topic.study_sessions.length > 0 &&
    topic.study_sessions.every((s) => s.theoryStatus === true)

  const rightQuestions = topic.study_sessions.reduce(
    (sum, s) => sum + (s.rightQuestions ?? 0),
    0
  )
  const wrongQuestions = topic.study_sessions.reduce(
    (sum, s) => sum + (s.wrongQuestions ?? 0),
    0
  )
  const questionsDurationSec = topic.study_sessions.reduce(
    (sum, s) => sum + (s.questionsDurationSec ?? 0),
    0
  )
  const performanceValues = topic.study_sessions
    .map((s) => (s.performancePercentage ? Number(s.performancePercentage) : 0))
    .filter((n) => !isNaN(n))

  const performancePercentage =
    performanceValues.length > 0
      ? performanceValues.reduce((a, b) => a + b, 0) / performanceValues.length
      : 0

  const totalStudingDurationSec = topic.study_sessions.reduce(
    (sum, s) => sum + (s.totalStudingDurationSec ?? 0),
    0
  )

  const questionStatus =
    topic.study_sessions.length > 0 &&
    topic.study_sessions.every((s) => s.questionStatus === true)

  const lastViewAtStr = topic.study_sessions
    .map((s) => s.viewAt)
    .filter(Boolean)
    .sort()
    .at(-1) as string | undefined
  const lastViewAt = lastViewAtStr ? new Date(lastViewAtStr) : null

  return {
    id: topic.id,
    title: topic.title,
    discipline: topic.discipline,
    study_sessions: topic.study_sessions.length,
    studySessionId: topic.study_sessions[0].id,
    scanningReadingDurationSec,
    skimmingReadingDurationSec,
    theoryStatus,
    pagesReaded,
    rightQuestions,
    wrongQuestions,
    questionStatus,
    questionsDurationSec,
    performancePercentage,
    totalStudingDurationSec,
    lastViewAt,
  }
}

function fmtMin(sec: number) {
  const minutes = Math.floor(sec / 60)
  return `${minutes} min`
}

export function StudiedTopicsTable({
  data,
  projectId,
}: {
  data: UiTopic[]
  projectId: string
}) {
  const rows = useMemo(() => data.map(toRow), [data])
  const columnHelper = createColumnHelper<TopicRow>()
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor('discipline', {
        id: 'discipline',
        header: ({ column }) => (
          <div className="flex items-center justify-center">
            <p className="font-bold">Disciplina</p>
            {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
            {column.getIsSorted() === 'desc' && (
              <ArrowDown className="size-3" />
            )}
            {column.getIsSorted() === false && (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: (info) => {
          return <Badge variant="outline">{info.getValue()}</Badge>
        },
      }),

      columnHelper.accessor('title', {
        id: 'title',
        header: ({ column }) => (
          <div className="flex items-center justify-center">
            <p className="font-bold">Tópico</p>
            {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
            {column.getIsSorted() === 'desc' && (
              <ArrowDown className="size-3" />
            )}
            {column.getIsSorted() === false && (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: (info) => <span>{info.getValue()}</span>,
      }),

      columnHelper.accessor('pagesReaded', {
        id: 'pagesReaded',
        enableSorting: true,
        sortingFn: 'alphanumeric',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger>
                <FileStack className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Páginas lidas</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
            {column.getIsSorted() === 'desc' && (
              <ArrowDown className="size-3" />
            )}
            {column.getIsSorted() === false && (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),

      columnHelper.accessor('rightQuestions', {
        id: 'rightQuestions',
        enableSorting: true,
        header: ({ column }) => {
          return (
            <div
              className="flex items-center justify-between text-green-500"
              onClick={column.getToggleSortingHandler()}
            >
              <Tooltip>
                <TooltipTrigger>
                  <Check className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Acertos</p>
                </TooltipContent>
              </Tooltip>
              {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
              {column.getIsSorted() === 'desc' && (
                <ArrowDown className="size-3" />
              )}
              {column.getIsSorted() === false && (
                <ArrowUpDown className="size-3" />
              )}
            </div>
          )
        },
        cell: ({ getValue }) => (
          <span className="font-semibold text-green-600">{getValue()}</span>
        ),
      }),

      columnHelper.accessor('wrongQuestions', {
        id: 'wrongQuestions',
        enableSorting: true,
        header: ({ column }) => (
          <div
            className="flex items-center justify-between text-red-500"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger>
                <X className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Erros</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
            {column.getIsSorted() === 'desc' && (
              <ArrowDown className="size-3" />
            )}
            {column.getIsSorted() === false && (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-semibold text-red-600">{getValue()}</span>
        ),
      }),

      columnHelper.accessor('performancePercentage', {
        id: 'performancePercentage',
        enableSorting: true,
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger>
                <Percent className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Desempenho</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => {
          return (
            <PerformanceBadge
              useIcon={false}
              size="text-xs"
              value={getValue()}
            />
          )
        },
      }),

      columnHelper.accessor('skimmingReadingDurationSec', {
        id: 'skimmingReadingDurationSec',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Timer className="size-4" /> Skimming
              </TooltipTrigger>
              <TooltipContent>
                <p>Tempo Skimming</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => <span>{fmtMin(getValue())}</span>,
      }),

      columnHelper.accessor('scanningReadingDurationSec', {
        id: 'scanningReadingDurationSec',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Timer className="size-4" /> Scanning
              </TooltipTrigger>
              <TooltipContent>
                <p>Tempo Scanning</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => <span>{fmtMin(getValue())}</span>,
      }),

      columnHelper.accessor('questionsDurationSec', {
        id: 'questionsDurationSec',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Timer className="size-4" /> Questões
              </TooltipTrigger>
              <TooltipContent>
                <p>Tempo Questões</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: ({ getValue }) => <span>{fmtMin(getValue())}</span>,
      }),

      columnHelper.accessor('lastViewAt', {
        id: 'lastViewAt',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <View className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Última sessão</p>
              </TooltipContent>
            </Tooltip>
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="size-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="size-3" />
            ) : (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: (info) =>
          info.getValue() ? (
            <span>
              {info.getValue()!.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      }),
      columnHelper.display({
        id: 'delete',
        header: () => null,
        cell: ({ row }) => {
          const { studySessionId } = row.original
          return (
            <DeleteStudySessionDialog
              studySessionId={studySessionId}
              projectId={projectId}
            />
          )
        },
      }),
    ],
    [columnHelper, projectId]
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer border-r dark:border-muted"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
                {{
                  asc: '',
                  desc: '',
                }[header.column.getIsSorted() as string] ?? null}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell ??
                        cell.column.columnDef.aggregatedCell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-4 text-center">
              Nenhum tópico estudado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
