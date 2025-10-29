import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash, TriangleAlert } from 'lucide-react'

import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

type DeleteProjectDialogProps = {
  projectId: string
}

export function DeleteProjectDialog({ projectId }: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const { mutateAsync: deleteProject } = useMutation({
    mutationFn: async (projectId: string) => {
      await api.post(`/projects/${projectId}/delete`)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Poxa...',
        description: 'Boa sorte no próximo!',
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      router.push('/follow-up')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Deu ruim!',
        description:
          'La vem você trazendo essa maré de azar para dentro do sistema',
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const handleDeleteProject = useCallback(
    async (id: string) => {
      await deleteProject(id)
    },
    [deleteProject]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar projeto</DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-center gap-6 text-sm">
            <TriangleAlert className="size-32 text-red-500" />
            <span className="text-xl font-bold">Atenção!</span>
            <span>
              <strong>Esta ação não tem volta. </strong>
              Se deletar este projeto, todas as disciplinas e tópicos assim como
              estatísticas de estudos vinculados serão excluídos
              permanentemente.
            </span>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
            className="disabled:cursor-not-allowed"
          >
            cancelar
          </Button>
          <Button
            onClick={() => handleDeleteProject(projectId)}
            type="submit"
            variant="destructive"
          >
            deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
