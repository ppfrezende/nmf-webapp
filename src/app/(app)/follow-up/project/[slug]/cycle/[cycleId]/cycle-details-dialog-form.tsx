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
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Form } from '@/components/ui/form'
import { useEffect, useRef, useState } from 'react'
import z from 'zod'
import type { Cycle } from '@/hooks/projects/use-projects'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { dirtyValues } from '@/lib/utils'

type UpdateCycleFormData = {
  title?: string
  status?: string
}

type CreateCycleDetailsDialogFormProps = {
  cycle: Cycle
}

export function CycleDetailsDialogForm({
  cycle,
}: CreateCycleDetailsDialogFormProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateCycleFormSchema = z.object({
    title: z.string().optional(),
    status: z.string().optional(),
  })

  const form = useForm<z.infer<typeof updateCycleFormSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      title: cycle.title,
      status: cycle.status,
    },
    resolver: zodResolver(updateCycleFormSchema),
  })

  const { errors } = form.formState

  function resetForm() {
    return form.reset()
  }

  const updateCycle = useMutation({
    mutationFn: async (data: UpdateCycleFormData) => {
      await api.put(
        `/projects/${cycle.projectId}/cycles/${cycle.id}/update`,
        data
      )
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Salvo! ',
        description: 'Já falei pra não mexer muito!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Falha!',
        description: 'Falha na atualização do ciclo.',
      })
    },
  })

  const dirtyFields = useRef<
    Partial<
      Readonly<{
        title?: boolean
        status?: boolean
      }>
    >
  >({})

  useEffect(() => {
    dirtyFields.current = form.formState.dirtyFields
  })

  useEffect(() => {
    if (cycle) {
      form.reset({
        title: cycle.title,
        status: cycle.status,
      })
    }
  }, [cycle, form])

  const handleUpdateCycle: SubmitHandler<UpdateCycleFormData> = async (
    values
  ) => {
    const modifiedValues = dirtyValues(dirtyFields.current, values)

    await updateCycle.mutateAsync(modifiedValues)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar ciclo</DialogTitle>
          <DialogDescription className="text-xs">
            <span>Aqui você pode editar o referido ciclo.</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateCycle)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do ciclo</Label>
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
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLANNING">
                          <Badge variant="planning">Planejando</Badge>
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          <Badge variant="in_progress">Em progresso</Badge>
                        </SelectItem>
                        <SelectItem value="ON_HOLD">
                          <Badge variant="outline">Em espera</Badge>
                        </SelectItem>
                        <SelectItem value="DONE">
                          <Badge variant="done">Feito</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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

              <Button type="submit">salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
