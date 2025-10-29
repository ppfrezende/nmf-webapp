import { Button } from '@/components/ui/button'

import { Trash, TriangleAlert } from 'lucide-react'

import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type DeleteStudySessionDialogProps = {
  projectId: string
  studySessionId: string
}

export function DeleteStudySessionDialog({
  projectId,
  studySessionId,
}: DeleteStudySessionDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutateAsync: deleteStudySession } = useMutation({
    mutationFn: async () => {
      await api.post(
        `/projects/${projectId}/study-sessions/${studySessionId}/delete`
      )
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Ihhh...',
        description: 'Removendo sessão né!? Olha lá em!',
      })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      queryClient.invalidateQueries({ queryKey: ['studied-topics'] })
      queryClient.invalidateQueries({ queryKey: ['discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-project-stats'] })
      setOpen(false)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Deu ruim!',
        description:
          'La vem você trazendo essa maré de azar para dentro do sistema',
      })
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      queryClient.invalidateQueries({ queryKey: ['studied-topics'] })
      queryClient.invalidateQueries({ queryKey: ['discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-project-stats'] })
      setOpen(false)
    },
  })

  const handleDeleteStudySession = useCallback(async () => {
    await deleteStudySession()
  }, [deleteStudySession])

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar disciplina</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-center justify-center gap-6 text-sm">
            <TriangleAlert className="size-32 text-red-500" />
            <span className="text-xl font-bold">Atenção!</span>
            <span>
              <strong>Esta ação não tem volta. </strong>
              Se deletar a disciplina, todos os tópicos assim como estatísticas
              de estudos vinculados à disciplina serão excluídos
              permanentemente.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Separator />

        <AlertDialogFooter>
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
            onClick={handleDeleteStudySession}
            type="submit"
            variant="destructive"
          >
            deletar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
