'use client'

import { z } from 'zod'

import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api-client'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useRef, useState } from 'react'
import { cn, dirtyValues } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Project } from '@/hooks/projects/use-projects'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface ProjectDetailsProps {
  data: Project
}

type UpdateProjectFormData = {
  title?: string
  board?: string
  examDate?: Date
  status?: string
}

export default function ProjectDetailsDialog({ data }: ProjectDetailsProps) {
  const [open, setOpen] = useState(false)
  const [openCalendar, setOpenCalendar] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const updateProjectFormSchema = z.object({
    title: z.string().min(1, { message: 'Campo obrigatório' }).optional(),
    board: z.string().min(1, { message: 'Campo obrigatório' }).optional(),
    examDate: z
      .preprocess(
        (v) =>
          typeof v === 'string' || typeof v === 'number' ? new Date(v) : v,
        z.date()
      )
      .optional(),
    status: z.string().min(1, { message: 'Campo obrigatório' }).optional(),
  })
  const form = useForm<z.infer<typeof updateProjectFormSchema>>({
    mode: 'onSubmit',
    defaultValues: {
      title: data.title,
      board: data.board,
      examDate: data.examDate,
      status: data.status,
    },
    resolver: zodResolver(updateProjectFormSchema),
  })

  const { errors, isDirty } = form.formState

  const updateProject = useMutation({
    mutationFn: async (project: UpdateProjectFormData) => {
      await api.put(`/projects/${data.id}/update`, project)
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Projeto atualizado! ',
        description: 'Não mexe muito que dá merda!',
      })

      queryClient.invalidateQueries({ queryKey: ['projects', data.id] })
      setOpen(false)
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Tá vendo!',
        description: 'Falei que ia dar merda',
      })
    },
  })

  const dirtyFields = useRef<
    Partial<
      Readonly<{
        title?: boolean
        board?: boolean
        examDate?: boolean
        status?: boolean
      }>
    >
  >({})

  useEffect(() => {
    dirtyFields.current = form.formState.dirtyFields
  })

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        status: data.status,
        examDate: data.examDate,
        board: data.board,
      })
    }
  }, [data, form])

  const handleUpdateProject: SubmitHandler<UpdateProjectFormData> = async (
    values
  ) => {
    const modifiedValues = dirtyValues(dirtyFields.current, values)
    await updateProject.mutateAsync(modifiedValues)
  }

  return (
    <>
      {data && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              <Edit className="cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Projeto</DialogTitle>
              <DialogDescription className="flex flex-col">
                <span>Atualize os campos abaixo se necessário</span>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateProject)}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      {...form.register('title')}
                      name="title"
                      id="title"
                    />
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
                    <Input
                      {...form.register('board')}
                      name="board"
                      id="board"
                    />
                    {errors.board && (
                      <div>
                        <p className="text-xs text-destructive">
                          {errors?.board?.message?.toString()}
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
                  <FormField
                    control={form.control}
                    name="examDate"
                    render={({ field, fieldState }) => {
                      return (
                        <FormItem className="mt-[10px] flex flex-col">
                          <Label htmlFor="examDate">Data da prova</Label>
                          <Popover
                            open={openCalendar}
                            onOpenChange={setOpenCalendar}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    !field.value && 'text-muted-foreground',
                                    fieldState.error && 'border-red-400'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Escolha uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                  setOpenCalendar(false)
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )
                    }}
                  />
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="reset"
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      form.reset()
                    }}
                    className="disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </Button>
                  <Button disabled={!isDirty} type="submit">
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
