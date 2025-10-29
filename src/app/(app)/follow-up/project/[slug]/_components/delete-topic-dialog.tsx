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

type DeleteTopicDialogProps = {
  projectId: string
  topicId: string
}

export function DeleteTopicDialog({
  projectId,
  topicId,
}: DeleteTopicDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutateAsync: deleteTopic } = useMutation({
    mutationFn: async (topicId: string) => {
      await api.post(`/projects/${projectId}/topics/${topicId}/delete`)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Ihhh...',
        description: 'Removendo tópico né!? Olha lá em!',
      })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      queryClient.invalidateQueries({ queryKey: ['studied-topics'] })
      queryClient.invalidateQueries({ queryKey: ['discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-discipline-stats'] })
      queryClient.invalidateQueries({
        queryKey: ['total-project-stats', projectId],
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Deu ruim!',
        description:
          'La vem você trazendo essa maré de azar para dentro do sistema',
      })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
    },
  })

  const handleDeleteTopic = useCallback(
    async (id: string) => {
      await deleteTopic(id)
    },
    [deleteTopic]
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
          <DialogTitle>Deletar tópico</DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-center gap-6 text-sm">
            <TriangleAlert className="size-32 text-red-500" />
            <span className="text-xl font-bold">Atenção!</span>
            <span>
              <strong>Esta ação não tem volta. </strong>
              Se deletar o tópico, todas as estatísticas de estudos vinculados a
              ele serão excluídos permanentemente.
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
            onClick={() => handleDeleteTopic(topicId)}
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
