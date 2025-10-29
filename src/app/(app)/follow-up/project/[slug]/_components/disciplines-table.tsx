'use client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ExpandedState,
} from '@tanstack/react-table'
import { Fragment, useEffect, useMemo, useState } from 'react'

import {
  Table,
  TableBody,
  TableCaption,
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
  ChevronDown,
  ChevronUp,
  FileStack,
  FileX,
  List,
  ListOrdered,
  LoaderIcon,
  Percent,
  RefreshCw,
  Signpost,
  Timer,
  X,
} from 'lucide-react'

import { cn, fmtMin } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api-client'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/services/api'
import { useToast } from '@/hooks/use-toast'
import { CreateDisciplinesFormDialog } from './create-disciplines-form'
import type { TotalDisciplinesStats } from '@/hooks/projects/use-disciplines'
import { Badge } from '@/components/ui/badge'
import { PerformanceBadge } from '@/components/ui/performance-percentage'
import { UpdateTopicFormDialog } from './update-topic-form'
import { DeleteTopicDialog } from './delete-topic-dialog'
import { CreateTopicsFormDialog } from './create-topics-form'
import { UpdateDisciplinesFormDialog } from './update-discipline-form-dialog'
import { DeleteDisciplineDialog } from './delete-discipline-dialog'

interface DisciplinesTableProps {
  debouncedSearchTerm?: string
  isPending: boolean
  disciplines: TotalDisciplinesStats[]
  projectId: string
}

export default function DisciplinesTable({
  // debouncedSearchTerm,
  projectId,
  disciplines,
  isPending,
}: DisciplinesTableProps) {
  const columnHelper = createColumnHelper<TotalDisciplinesStats>()
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [data, setData] = useState<TotalDisciplinesStats[]>(disciplines ?? [])
  useEffect(() => setData(disciplines ?? []), [disciplines])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const { mutateAsync: reorderDisciplines } = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await api.patch(`/projects/${projectId}/disciplines/reorder`, {
        orderedIds,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
    onError: (error: AxiosError<ApiError>) => {
      const description =
        error.response?.data.message === 'Resource already exists'
          ? 'Parece que colocou uma disciplina que já existe!'
          : 'La vem você trazendo essa maré de azar para dentro do sistema'
      toast({
        variant: 'destructive',
        title: 'Deu ruim!',
        description,
      })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'drag',
        header: () => (
          <Tooltip>
            <TooltipTrigger>
              <ListOrdered className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Arraste para reordenar</p>
            </TooltipContent>
          </Tooltip>
        ),
        enableSorting: false,
        cell: () => <span className="cursor-grab select-none px-1">⋮⋮</span>,
        size: 24,
      }),
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
        cell: ({ row, getValue }) => {
          return (
            <Button
              variant="ghost"
              className="text-xs"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getCanExpand() ? (
                <div className="flex items-center gap-4">
                  {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
                  <Badge variant="outline">{getValue()}</Badge>
                </div>
              ) : (
                <>
                  {' '}
                  <p>{getValue()}</p>
                </>
              )}
            </Button>
          )
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
      columnHelper.display({
        id: 'update',
        header: () => null,
        cell: ({ row }) => {
          const { disciplineId, disciplineName, disciplineNotes } =
            row.original as TotalDisciplinesStats
          return (
            <UpdateDisciplinesFormDialog
              disciplineId={disciplineId}
              disciplineName={disciplineName}
              disciplineNotes={disciplineNotes}
              projectId={projectId}
            />
          )
        },
      }),
      columnHelper.display({
        id: 'delete',
        header: () => null,
        cell: ({ row }) => {
          const { disciplineId } = row.original as TotalDisciplinesStats
          return (
            <DeleteDisciplineDialog
              disciplineId={disciplineId}
              projectId={projectId}
            />
          )
        },
      }),
    ],
    [columnHelper, projectId]
  )

  const table = useReactTable({
    data,
    columns,
    state: { expanded, sorting },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.disciplineId,
    debugTable: false,
  })

  const visibleRows = table.getRowModel().rows.slice(0, 50)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function SortableRow({ row }: { row: any }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: row.id })
    row._dragListeners = { ...attributes, ...listeners }

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <TableRow ref={setNodeRef} style={style}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {row.getVisibleCells().map((cell: any) => {
          const isDragCell = cell.column.id === 'drag'
          return (
            <TableCell
              key={cell.id}
              // 👉 listeners vão DIRETO no handle
              {...(isDragCell ? { ...attributes, ...listeners } : {})}
              className={isDragCell ? 'w-6 cursor-grab select-none' : undefined}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return

    // evita confusão se usuário aplicou sorting manual
    if (sorting.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Atenção!',
        description:
          'Tem algum filtro ativo. Nesse caso, não é possível reordenar as disciplinas!',
      })
      return
    }

    const rows = table.getRowModel().rows
    const oldIndex = rows.findIndex((r) => r.id === active.id)
    const newIndex = rows.findIndex((r) => r.id === over.id)

    const newData = arrayMove(data, oldIndex, newIndex)
    setData(newData)

    // persiste (ordem final por IDs)
    const orderedIds = newData.map((d) => d.disciplineId)
    await reorderDisciplines(orderedIds)
  }

  return (
    <>
      <div className="rounded-lg border p-4 shadow-sm dark:border-muted">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-center justify-between">
            <CreateDisciplinesFormDialog projectId={projectId} />

            <Button
              disabled={!(sorting.length > 0)}
              variant="reset_sorting"
              onClick={() => setSorting([])}
            >
              <RefreshCw /> resetar classificação
            </Button>
          </div>
          {isPending && (
            <div className="flex items-center justify-center">
              <LoaderIcon className="animate-spin" />
            </div>
          )}
          {!isPending && data.length === 0 ? (
            <div className="m-16 flex flex-col items-center justify-center gap-6">
              <FileX className="size-24" />
              <span className="text-sm font-light italic">
                Nenhuma disciplina cadastrada!
              </span>
            </div>
          ) : (
            <Table className="mt-6">
              <TableCaption className="border-t pt-2 text-xs dark:border-t-muted">
                <Signpost className="text-teal-500" />
                <span className="italic">
                  *Passe o mouse sobre as colunas para ver o que cada uma
                  significa.*
                </span>
              </TableCaption>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          'cursor-pointer select-none border-r px-2 py-1 transition-colors dark:border-muted',
                          header.column.getIsSorted() // se está ordenada
                            ? 'bg-primary/10 text-primary' // estilo quando ativa
                            : 'hover:bg-muted/40' // hover normal
                        )}
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
                <SortableContext
                  items={visibleRows.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {visibleRows.map((row) => (
                    <Fragment key={row.id}>
                      <SortableRow row={row} />

                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell
                            className="space-y-2 px-8 pb-3"
                            colSpan={columns.length}
                          >
                            {row.original.topicsCount === 0 ? (
                              <div className="rounded-md border p-4">
                                <div className="flex items-center justify-center">
                                  <h1>Não há tópicos adicionados ainda</h1>
                                </div>
                                <CreateTopicsFormDialog
                                  disciplineId={row.original.disciplineId}
                                  disciplineName={row.original.disciplineName}
                                  projectId={projectId}
                                />
                              </div>
                            ) : (
                              <div className="rounded-md border p-4 dark:border-muted">
                                <Table className="w-full table-fixed">
                                  <TableHeader className="border-b dark:border-b-muted">
                                    <TableRow>
                                      <TableHead className="w-[85%] border-r dark:border-muted">
                                        Tópicos
                                      </TableHead>
                                      <TableHead className="border-r dark:border-muted"></TableHead>
                                      <TableHead className="border-r dark:border-muted"></TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {row.original.topics.map((topic, index) => (
                                      <TableRow key={index}>
                                        <TableCell className="space-y-2 px-8 pb-3">
                                          {topic.title}
                                        </TableCell>
                                        <TableCell>
                                          <UpdateTopicFormDialog
                                            disciplineId={
                                              row.original.disciplineId
                                            }
                                            projectId={projectId}
                                            topic={topic}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <DeleteTopicDialog
                                            topicId={topic.id}
                                            projectId={projectId}
                                          />
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <CreateTopicsFormDialog
                                  disciplineId={row.original.disciplineId}
                                  disciplineName={row.original.disciplineName}
                                  projectId={projectId}
                                />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          )}
        </DndContext>
      </div>
    </>
  )
}
