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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  FileStack,
  List,
  Percent,
  Timer,
  X,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { PerformanceBadge } from '@/components/ui/performance-percentage'
import type { DisciplinesStats } from '@/hooks/projects/use-disciplines'
import { Button } from '@/components/ui/button'
import { fmtMin } from '@/lib/utils'

type DisciplinesStatsTableProps = {
  disciplinesStatsData: DisciplinesStats[]
}

export function DisciplinesStatsTable({
  disciplinesStatsData,
}: DisciplinesStatsTableProps) {
  const columnHelper = createColumnHelper<DisciplinesStats>()
  const [sorting, setSorting] = useState<SortingState>([])

  const data = disciplinesStatsData ?? []

  const columns = useMemo(
    () => [
      columnHelper.accessor('disciplineName', {
        id: 'disciplineName',
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

      columnHelper.accessor('topicsCount', {
        id: 'topicsCount',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger>
                <List className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tópicos</p>
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
      columnHelper.accessor('avarageSecondsPerPage', {
        id: 'avarageSecondsPerPage',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Timer className="size-4" /> ppm
              </TooltipTrigger>
              <TooltipContent>
                <p>Pág por minuto</p>
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
        cell: ({ getValue }) => <span>{fmtMin(getValue()!)}</span>,
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
              value={Number(getValue())}
            />
          )
        },
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
      columnHelper.accessor('avarageSecondsPerQuestion', {
        id: 'avarageSecondsPerQuestion',
        header: ({ column }) => (
          <div
            className="flex items-center justify-between"
            onClick={column.getToggleSortingHandler()}
          >
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Timer className="size-4" /> mpq
              </TooltipTrigger>
              <TooltipContent>
                <p>Minutos por questão</p>
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
        cell: ({ getValue }) => <span>{fmtMin(getValue()!)}</span>,
      }),
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <Button variant="outline" onClick={() => setSorting([])}>
        resetar filtros <ArrowUpDown className="size-3" />
      </Button>
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
                Nenhuma disciplina estudada nesse ciclo
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
