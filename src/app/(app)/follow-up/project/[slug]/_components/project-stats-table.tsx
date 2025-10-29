import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import type { TotalProjectStats } from '@/hooks/projects/use-projects'
import { Check, ClipboardPen, FileStack, List, X } from 'lucide-react'

type ProjectStatsTableProps = {
  projectStats: TotalProjectStats
}

export function ProjectStatsTable({ projectStats }: ProjectStatsTableProps) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-medium">
            <List className="size-4" />
            Total de tópicos
          </TableCell>
          <TableCell className="border-l font-medium dark:border-l-muted">
            {projectStats.topicsCount}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-medium">
            <FileStack className="size-4" />
            Páginas lidas
          </TableCell>
          <TableCell className="border-l font-medium dark:border-l-muted">
            {projectStats.pagesReaded}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex items-center gap-2 font-medium">
            <ClipboardPen className="size-4" /> Questões feitas
          </TableCell>
          <TableCell className="border-l font-medium dark:border-l-muted">
            {projectStats.rightQuestions + projectStats.wrongQuestions}
          </TableCell>
        </TableRow>
        <TableRow className="text-green-500">
          <TableCell className="flex items-center gap-2 font-medium ">
            <Check className="size-4" /> Acertos
          </TableCell>
          <TableCell className="border-l font-medium dark:border-l-muted">
            {projectStats.rightQuestions}
          </TableCell>
        </TableRow>
        <TableRow className="text-red-500">
          <TableCell className="flex items-center gap-2 font-medium ">
            <X className="size-4" /> Erros
          </TableCell>
          <TableCell className="border-l font-medium dark:border-l-muted">
            {projectStats.wrongQuestions}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
