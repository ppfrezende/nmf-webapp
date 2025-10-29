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

type CreateProjectFormData = {
  title: string
  board: string
}

export function CreateProjectFormDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const createProjectFormSchema = z.object({
    title: z.string().min(1, { message: 'Campo obrigatório' }),
    board: z.string().min(1, { message: 'Campo obrigatório' }),
  })

  const form = useForm<z.infer<typeof createProjectFormSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(createProjectFormSchema),
  })

  const { errors } = form.formState

  function resetForm() {
    return form.reset()
  }

  const createProject = useMutation({
    mutationFn: async (project: CreateProjectFormData) => {
      await api.post(`/projects/create`, project)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Aee, tomou vergonha! ',
        description: 'O primeiro passo foi dado, AGORA SENTA E ESTUDA!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Falha!',
        description: 'Falha na criação do projeto.',
      })
    },
  })

  const handleCreateProject: SubmitHandler<CreateProjectFormData> = async (
    values
  ) => {
    await createProject.mutateAsync(values)
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
          <DialogTitle>Criar projeto</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>Resolveu tomar vergonha na cara né?!</span>
            <span>Bora criar esse projeto para sua aprovação!</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateProject)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
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
                <Label htmlFor="board">Banca</Label>
                <Input {...form.register('board')} name="board" id="board" />
                {errors.board && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.board?.message?.toString()}
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
