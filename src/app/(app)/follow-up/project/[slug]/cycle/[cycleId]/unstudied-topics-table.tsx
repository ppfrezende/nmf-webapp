'use client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  type GroupingState,
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
import type { UiTopic } from '@/hooks/projects/use-studied-topics'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export function UnstudiedTopicsTable({ data }: { data: UiTopic[] }) {
  const columnHelper = createColumnHelper<UiTopic>()
  const [sorting, setSorting] = useState<SortingState>([])
  const [grouping] = useState<GroupingState>(['discipline'])

  const columns = useMemo(
    () => [
      columnHelper.accessor('discipline', {
        id: 'discipline',
        header: () => <></>,
        enableGrouping: true,
        cell: ({ row }) => (row.getIsGrouped() ? null : null),
        aggregatedCell: () => null,
      }),
      columnHelper.accessor('title', {
        id: 'title',
        header: ({ column }) => (
          <div className="flex items-center justify-center">
            <p className="text-sm font-bold">Tópico</p>
            {column.getIsSorted() === 'asc' && <ArrowUp className="size-3" />}
            {column.getIsSorted() === 'desc' && (
              <ArrowDown className="size-3" />
            )}
            {column.getIsSorted() === false && (
              <ArrowUpDown className="size-3" />
            )}
          </div>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
    ],
    [columnHelper]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, grouping, expanded: true },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
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
            if (row.getIsGrouped()) {
              return (
                <TableRow key={row.id}>
                  <TableCell colSpan={columns.length}>
                    <div className="flex h-6 items-center justify-center gap-6 rounded-sm bg-gray-200 dark:bg-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {row.getValue<string>('discipline')}
                        </span>
                        <span className="text-muted-foreground">
                          ({row.subRows.length} tópicos)
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            }

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
