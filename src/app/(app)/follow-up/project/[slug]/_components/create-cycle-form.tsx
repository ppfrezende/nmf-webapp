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
import { Plus } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Form } from '@/components/ui/form'
import { useState } from 'react'
import z from 'zod'
import type { Project } from '@/hooks/projects/use-projects'
import { Textarea } from '@/components/ui/textarea'

type CreateCycleFormData = {
  title: string
  notes?: string
}

type CreateCycleFormDialogProps = {
  project: Project
}

export function CreateCycleFormDialog({ project }: CreateCycleFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createCycleFormSchema = z.object({
    title: z.string().min(1, { message: 'Campo obrigatório' }),
    notes: z.string().optional(),
  })

  const form = useForm<z.infer<typeof createCycleFormSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(createCycleFormSchema),
  })

  const { errors } = form.formState

  function resetForm() {
    return form.reset()
  }

  const createCycle = useMutation({
    mutationFn: async (cycle: CreateCycleFormData) => {
      await api.post(`/projects/${project.id}/cycles/create`, cycle)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Bora para mais uma etapa! ',
        description: 'O segredo está na constância e disciplina!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Falha!',
        description: 'Falha na criação do ciclo.',
      })
    },
  })

  const handleCreateCycle: SubmitHandler<CreateCycleFormData> = async (
    values
  ) => {
    await createCycle.mutateAsync(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Começar um ciclo</DialogTitle>
          <DialogDescription className="flex flex-col text-xs">
            <span>Aqui você pode criar um ciclo.</span>
            <span>
              O intuito é que você estude o todos os tópicos usando uma
              metodologia de sua preferência.
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateCycle)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Título</Label>
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
                <Label htmlFor="board">Observações</Label>
                <Textarea {...form.register('notes')} name="notes" id="notes" />
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
