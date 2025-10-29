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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Form } from '@/components/ui/form'
import { useEffect, useRef, useState } from 'react'
import z from 'zod'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/services/api'
import type { Topic } from '@/hooks/projects/use-projects'
import { dirtyValues } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

type UpdateTopicFormData = {
  title: string
  notes: string | null
}

type UpdateTopicFormDialogProps = {
  topic: Topic
  disciplineId: string
  projectId: string
}

export function UpdateTopicFormDialog({
  topic,
  disciplineId,
  projectId,
}: UpdateTopicFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateTopicFormSchema = z.object({
    title: z.string().min(1, { message: 'Campo obrigatório' }),
    notes: z.string().nullable(),
  })

  const form = useForm<z.infer<typeof updateTopicFormSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      title: topic.title,
      notes: topic.notes,
    },
    resolver: zodResolver(updateTopicFormSchema),
  })

  function resetForm() {
    return form.reset()
  }

  const { errors, isDirty } = form.formState

  const updateTopic = useMutation({
    mutationFn: async (data: Partial<UpdateTopicFormData>) => {
      await api.put(
        `/projects/${projectId}/disciplines/${disciplineId}/topics/${topic.id}/update`,
        data
      )
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Humm, ta bom! ',
        description: 'Não mexe muito que da merda!!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId],
      })
      queryClient.invalidateQueries({ queryKey: ['studied-topics'] })
      queryClient.invalidateQueries({ queryKey: ['discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-discipline-stats'] })
      queryClient.invalidateQueries({
        queryKey: ['total-project-stats', projectId],
      })
    },
    onError: (error: AxiosError<ApiError>) => {
      const description =
        error.response?.data.message === 'Resource already exists'
          ? 'Parece que colocou um tópico que já existe!'
          : 'La vem você trazendo essa maré de azar para dentro do sistema'
      toast({
        variant: 'destructive',
        title: 'Deu ruim!',
        description,
      })
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId],
      })
    },
  })

  const dirtyFields = useRef<
    Partial<
      Readonly<{
        title?: boolean
        notes?: boolean
      }>
    >
  >({})

  useEffect(() => {
    dirtyFields.current = form.formState.dirtyFields
  })

  useEffect(() => {
    if (topic) {
      form.reset({
        title: topic.title,
        notes: topic.notes,
      })
    }
  }, [form, topic])

  const handleUpdateTopic: SubmitHandler<UpdateTopicFormData> = async (
    values
  ) => {
    const modifiedValues = dirtyValues(dirtyFields.current, values)

    await updateTopic.mutateAsync(modifiedValues)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Editar tópico</DialogTitle>
          <DialogDescription className="text-xs">
            <span>Aqui você pode editar o referido tópico.</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateTopic)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do tópico</Label>
                <Input {...form.register('title')} name="title" id="title" />
                {errors.title && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.title?.message?.toString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  rows={5}
                  {...form.register('notes')}
                  name="notes"
                  id="notes"
                />
                {errors.notes && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.notes?.message?.toString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
                className="disabled:cursor-not-allowed"
              >
                cancelar
              </Button>
              <Button disabled={!isDirty} type="submit">
                salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
