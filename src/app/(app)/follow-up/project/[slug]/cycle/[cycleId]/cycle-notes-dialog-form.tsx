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
import { Edit } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/services/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Form } from '@/components/ui/form'
import { useEffect, useRef, useState } from 'react'
import z from 'zod'
import type { Cycle } from '@/hooks/projects/use-projects'
import { Textarea } from '@/components/ui/textarea'
import { dirtyValues } from '@/lib/utils'

type UpdateCycleFormData = {
  notes: string | null
}

type CreateCycleDetailsDialogFormProps = {
  cycle: Cycle
}

export function CycleNotesDialogForm({
  cycle,
}: CreateCycleDetailsDialogFormProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateCycleFormSchema = z.object({
    notes: z.string().nullable(),
  })

  const form = useForm<z.infer<typeof updateCycleFormSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      notes: cycle.notes,
    },
    resolver: zodResolver(updateCycleFormSchema),
  })

  const { errors } = form.formState

  function resetForm() {
    return form.reset()
  }

  const updateCycle = useMutation({
    mutationFn: async (data: Partial<UpdateCycleFormData>) => {
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
        notes?: boolean
      }>
    >
  >({})

  useEffect(() => {
    dirtyFields.current = form.formState.dirtyFields
  })

  useEffect(() => {
    if (cycle) {
      form.reset({
        notes: cycle.notes,
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
        <Edit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Observações 🗒️</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateCycle)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Textarea
                  rows={10}
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
