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
import { Plus, Trash } from 'lucide-react'
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Form } from '@/components/ui/form'
import { useEffect, useState } from 'react'
import z from 'zod'
import { Separator } from '@/components/ui/separator'
import type { AxiosError } from 'axios'
import type { ApiError } from '@/services/api'

type CreateDisciplineFormData = {
  disciplines: {
    name: string
  }[]
}

type CreateDisciplinesFormDialogProps = {
  projectId: string
}

export function CreateDisciplinesFormDialog({
  projectId,
}: CreateDisciplinesFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createDisciplinesFormSchema = z.object({
    disciplines: z
      .array(
        z.object({
          name: z.string().min(1, { message: 'Campo obrigatório' }),
        })
      )
      .nonempty('Precisa de pelo menos 1 disciplina'),
  })

  const form = useForm<z.infer<typeof createDisciplinesFormSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      disciplines: [{ name: '' }],
    },
    resolver: zodResolver(createDisciplinesFormSchema),
  })

  function resetForm() {
    return form.reset()
  }

  const createDisciplines = useMutation({
    mutationFn: async (disciplines: CreateDisciplineFormData) => {
      await api.post(`/projects/${projectId}/disciplines/create`, disciplines)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Booa! ',
        description: 'Se adicionou a matéria é pra estudar EM PORRAAA!!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
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

  const handleCreateDisciplines: SubmitHandler<
    CreateDisciplineFormData
  > = async (values) => {
    await createDisciplines.mutateAsync(values)
  }

  const control = form.control

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'disciplines',
  })

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '' })
    }
  }, [fields, append])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="cursor-pointer" /> disciplina
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Adicionar disciplinas</DialogTitle>
          <DialogDescription className="text-xs">
            <span>
              Aqui você pode adicionar uma ou mais disciplinas do seu concurso.
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateDisciplines)}>
            <div className="m-4 flex max-h-[680px] flex-col overflow-y-auto rounded-sm border p-4 dark:border-muted">
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    {index >= 1 && <Separator className="my-4" />}
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                      <Label htmlFor={`disciplines.${index}.name`}>
                        Disciplina:
                      </Label>
                      <Controller
                        control={form.control}
                        name={`disciplines.${index}.name`}
                        render={({ fieldState }) => {
                          return (
                            <>
                              <Input
                                {...form.register(`disciplines.${index}.name`)}
                                name={`disciplines.${index}.name`}
                                id={`disciplines.${index}.name`}
                              />
                              {fieldState.error && (
                                <div>
                                  <p className="text-xs text-destructive">
                                    {fieldState.error?.message!.toString()}
                                  </p>
                                </div>
                              )}
                            </>
                          )
                        }}
                      />

                      {index === 0 ? (
                        <></>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <Button
              type="button"
              variant="default"
              className="mt-4 self-center"
              onClick={() => append({ name: '' })}
            >
              {fields.length > 0
                ? 'adicionar mais uma disciplina'
                : 'adicionar disciplina'}
              <Plus />
            </Button>

            <DialogFooter className="mt-4">
              <Button
                type="reset"
                variant="secondary"
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                cancelar
              </Button>
              <Button type="reset" variant="outline" onClick={resetForm}>
                limpar
              </Button>
              <Button type="submit">salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
