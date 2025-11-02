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
import {
  Brain,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleCheckBig,
  ClipboardPenLine,
  Clock,
  FileStack,
  LibraryBig,
  Plus,
  X,
} from 'lucide-react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import z from 'zod'
import type {
  Cycle,
  Discipline,
  Project,
  Topic,
} from '@/hooks/projects/use-projects'
import { NumericFormat } from 'react-number-format'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Popover } from '@radix-ui/react-popover'
import { PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { truncateString } from '@/lib/truncate-string'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { api } from '@/services/api-client'

type CreateStudySessionFormData = {
  scanningReadingDurationSec?: number | null
  skimmingReadingDurationSec?: number | null
  pagesReaded?: number | null
  theoryStatus?: boolean

  rightQuestions?: number | null
  wrongQuestions?: number | null
  questionsDurationSec?: number | null
  questionStatus?: boolean

  notes?: string | null
  viewAt?: Date | null

  studyMethod?: string | null
}

type CreateStudySessionFormDialogProps = {
  project: Project
  cycle: Cycle
}

type ApiCustomError = {
  response: {
    data: {
      code: string
    }
  }
}

export function CreateStudySessionFormDialog({
  project,
  cycle,
}: CreateStudySessionFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [openCalendar, setOpenCalendar] = useState(false)

  const [openDisciplineDropdown, setOpenDisciplineDropdown] = useState(false)
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null)

  const handleDisciplineSelect = (discipline: Discipline) => {
    setSelectedDiscipline(discipline)
    form.setValue('disciplineId', discipline?.id)
  }

  const [openTopicDropdown, setOpenTopicDropdown] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    form.setValue('topicId', topic?.id)
  }

  const createStudySessionFormSchema = z.object({
    skimmingReadingDurationSec: z.number().int().min(0),
    scanningReadingDurationSec: z.number().int().min(0),
    pagesReaded: z.number().int().min(0),
    theoryStatus: z.boolean(),

    rightQuestions: z.number().int().min(0),
    wrongQuestions: z.number().int().min(0),
    questionsDurationSec: z.number().int().min(0),
    questionStatus: z.boolean(),

    notes: z.string().max(10_000).nullable().optional(),
    viewAt: z.preprocess(
      (v) => (typeof v === 'string' || typeof v === 'number' ? new Date(v) : v),
      z.date()
    ),
    studyMethod: z.string().nullable().optional(),
    topicId: z.string(),
    disciplineId: z.string(),
  })

  const form = useForm<z.infer<typeof createStudySessionFormSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(createStudySessionFormSchema),
  })

  const { errors } = form.formState

  function resetForm() {
    setSelectedDiscipline(null)
    setSelectedTopic(null)
    return form.reset()
  }

  const createStudySession = useMutation({
    mutationFn: async (study_session_data: CreateStudySessionFormData) => {
      await api.post(
        `/projects/${project.id}/cycles/${cycle.id}`,
        study_session_data
      )
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'VENCEU MAIS UM LEÃO! ',
        description: 'O segredo está na constância e disciplina!',
      })

      resetForm()
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['studied-topics'] })
      queryClient.invalidateQueries({ queryKey: ['discipline-stats'] })
      queryClient.invalidateQueries({ queryKey: ['total-discipline-stats'] })
    },
    onError: (err: ApiCustomError) => {
      if (err.response?.data?.code === 'DUPLICATED_SESSION') {
        toast({
          variant: 'destructive',
          title: 'Calma! Se liga...',
          description:
            'Você inseriu uma sessão de estudos de um tópico já estudado neste ciclo. Se por acaso deseja dar continuidade ao tópico, só atualizar as informações no tópico estudado.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Ops!',
          description: 'Falha ao inserir sessão de estudos.',
        })
      }
    },
  })

  const handleCreateStudySession: SubmitHandler<
    CreateStudySessionFormData
  > = async (values) => {
    await createStudySession.mutateAsync(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="init_study_session">
          <Plus /> sessão de estudo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-full max-w-[720px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sessão de estudo</DialogTitle>
          <DialogDescription className="flex flex-col gap-1 text-xs">
            <span>
              Ligue o cronômetro do seu PC, estude e só depois volte aqui para
              informar a disciplina, o tópico e outras informações.
            </span>
            <span>Aqui você pode cadastrar uma sessão de estudos.</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateStudySession, (err) => {
              console.log('RHF validation errors:', err)
              // opcional: toast de erro amigável
              // toast({ variant:'destructive', title: 'Corrija os campos destacados' })
            })}
          >
            <div className="mx-auto flex flex-col gap-4">
              <FormField
                control={form.control}
                name="viewAt"
                render={({ field, fieldState }) => {
                  return (
                    <FormItem className="mt-[10px] flex flex-col">
                      <Label htmlFor="viewAt">Data do estudo</Label>
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
                        <PopoverContent className="w-auto p-0" align="start">
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="viewAt">Disciplina/Tópico</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormItem>
                      <FormControl>
                        <Popover
                          open={openDisciplineDropdown}
                          onOpenChange={setOpenDisciplineDropdown}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openDisciplineDropdown}
                              // disabled={disabled}
                              className={cn(
                                'w-full justify-between',
                                form.formState.errors.disciplineId &&
                                  'border-red-400'
                              )}
                            >
                              {selectedDiscipline ? (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {truncateString(
                                      selectedDiscipline.name,
                                      34
                                    )}
                                  </Badge>
                                </div>
                              ) : (
                                <span>Selecione uma disciplina...</span>
                              )}
                              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput
                                className="p-2"
                                placeholder="Pesquisar..."
                              />
                              <CommandList>
                                <CommandEmpty>
                                  <h1 className="text-xs">
                                    Nenhuma disciplina encontrada
                                  </h1>
                                </CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea>
                                    {project?.disciplines.map((discipline) => (
                                      <CommandItem
                                        key={discipline.id}
                                        value={discipline.name}
                                        onSelect={() => {
                                          handleDisciplineSelect(discipline)
                                          setOpenDisciplineDropdown(false)
                                          form.clearErrors('disciplineId')
                                        }}
                                      >
                                        {discipline.name}
                                        <Check
                                          className={cn(
                                            'h-4 w-4',
                                            selectedDiscipline?.id ===
                                              discipline.id
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                    {/* <ScrollBar orientation="vertical" /> */}
                                  </ScrollArea>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                    {form.formState.errors.disciplineId && (
                      <FormMessage className="text-xs">
                        campo obrigatório
                      </FormMessage>
                    )}
                  </div>

                  {selectedDiscipline && (
                    <div>
                      <FormItem>
                        <FormControl>
                          <Popover
                            open={openTopicDropdown}
                            onOpenChange={setOpenTopicDropdown}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openTopicDropdown}
                                // disabled={disabled}
                                className={cn(
                                  'w-full justify-between',
                                  form.formState.errors.topicId &&
                                    'border-red-400'
                                )}
                              >
                                {selectedTopic ? (
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                      {truncateString(selectedTopic.title, 34)}
                                    </Badge>
                                  </div>
                                ) : (
                                  <span>Selecione um tópico</span>
                                )}
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Pesquisar..." />
                                <CommandList>
                                  <CommandEmpty>
                                    <h1 className="text-xs">
                                      Nenhum tópico encontrado
                                    </h1>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    <ScrollArea>
                                      {project?.disciplines
                                        .find(
                                          (discipline) =>
                                            discipline.id ===
                                            selectedDiscipline.id
                                        )
                                        ?.topics.map((topic) => {
                                          return (
                                            <CommandItem
                                              key={topic.id}
                                              value={topic.title}
                                              onSelect={() => {
                                                handleTopicSelect(topic)
                                                setOpenTopicDropdown(false)
                                                form.clearErrors('topicId')
                                              }}
                                            >
                                              {topic.title}
                                              <Check
                                                className={cn(
                                                  'h-4 w-4',
                                                  selectedTopic?.id === topic.id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                            </CommandItem>
                                          )
                                        })}
                                      {/* <ScrollBar orientation="vertical" /> */}
                                    </ScrollArea>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                      {form.formState.errors.topicId && (
                        <FormMessage className="text-xs font-light">
                          campo obrigatório
                        </FormMessage>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative mt-2">
                <Label className="absolute -top-5 left-2 flex gap-1 rounded-t-lg border-s-[1px] border-t-[1px] bg-orange-50 p-2 dark:border-muted dark:bg-muted">
                  <LibraryBig size={14} />
                  Teoria
                </Label>
                <div
                  className={cn(
                    'grid grid-cols-8 gap-4 rounded-lg border p-4 shadow-sm dark:border-muted',
                    (form.formState.errors.skimmingReadingDurationSec ||
                      form.formState.errors.scanningReadingDurationSec ||
                      form.formState.errors.pagesReaded) &&
                      'border-red-400'
                  )}
                >
                  <div className="col-span-2 space-y-1">
                    <Label
                      className="flex items-center"
                      htmlFor="skimmingReadingDurationSec"
                    >
                      <Clock size={14} />
                      Skimming
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="skimmingReadingDurationSec"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            className="placeholder:text-xs placeholder:text-gray-300"
                            placeholder="min"
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Math.floor(Number(field.value) / 60)}
                            onValueChange={(value) => {
                              const minutes = value.floatValue ?? 0
                              field.onChange(minutes * 60)
                            }}
                            name={field.name}
                            suffix=" min"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label
                      className="flex items-center"
                      htmlFor="scanningReadingDurationSec"
                    >
                      <Clock size={14} />
                      Scanning
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="scanningReadingDurationSec"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            className="placeholder:text-xs placeholder:text-gray-300"
                            placeholder="min"
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Math.floor(Number(field.value) / 60)}
                            onValueChange={(value) => {
                              const minutes = value.floatValue ?? 0
                              field.onChange(minutes * 60)
                            }}
                            name={field.name}
                            suffix=" min"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="flex items-center" htmlFor="pagesReaded">
                      <FileStack size={14} />
                      Págs Lidas
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="pagesReaded"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            placeholder=""
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Number(field.value)}
                            onValueChange={({ floatValue }) => {
                              field.onChange(floatValue)
                            }}
                            name={field.name}
                            suffix=" págs"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <FormLabel className="flex items-center gap-2">
                      <CircleCheckBig size={14} /> Teoria
                    </FormLabel>
                    <div className="flex flex-row items-start rounded-md border p-[9px] dark:border-muted">
                      <Controller
                        control={form.control}
                        name="theoryStatus"
                        defaultValue={false}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                {(form.formState.errors.skimmingReadingDurationSec ||
                  form.formState.errors.scanningReadingDurationSec ||
                  form.formState.errors.pagesReaded) && (
                  <FormMessage className="text-xs font-light">
                    Os campos de leitura são obrigatórios. Se não leu nada,
                    coloque 0 (zero).
                  </FormMessage>
                )}
              </div>
              <div className="relative mt-2">
                <Label className="absolute -top-5 left-2 flex gap-1 rounded-t-lg border-s-[1px] border-t-[1px] bg-orange-50 p-2 dark:border-muted dark:bg-muted">
                  <ClipboardPenLine size={14} />
                  Questões
                </Label>
                <div
                  className={cn(
                    'grid grid-cols-8 gap-4 rounded-lg border p-4 shadow-sm dark:border-muted',
                    (form.formState.errors.rightQuestions ||
                      form.formState.errors.wrongQuestions ||
                      form.formState.errors.questionsDurationSec) &&
                      'border-red-400'
                  )}
                >
                  <div className="col-span-2 space-y-1">
                    <Label
                      className="flex items-center text-green-500"
                      htmlFor="rightQuestions"
                    >
                      <Check size={14} />
                      Certas
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="rightQuestions"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            placeholder=""
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Number(field.value)}
                            onValueChange={({ floatValue }) => {
                              field.onChange(floatValue)
                            }}
                            name={field.name}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label
                      className="flex items-center text-red-500"
                      htmlFor="wrongQuestions"
                    >
                      <X size={14} /> Erradas
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="wrongQuestions"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            placeholder=""
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Number(field.value)}
                            onValueChange={({ floatValue }) => {
                              field.onChange(floatValue)
                            }}
                            name={field.name}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label
                      className="flex items-center"
                      htmlFor="questionsDurationSec"
                    >
                      Tempo
                    </Label>
                    <div className="col-span-12 flex flex-col items-start gap-1 md:col-span-10">
                      <Controller
                        control={form.control}
                        name="questionsDurationSec"
                        // defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            customInput={Input}
                            className="placeholder:text-xs placeholder:text-gray-300"
                            placeholder="min"
                            decimalScale={0}
                            fixedDecimalScale
                            allowNegative={false}
                            value={Math.floor(Number(field.value) / 60)}
                            onValueChange={(value) => {
                              const minutes = value.floatValue ?? 0
                              field.onChange(minutes * 60)
                            }}
                            name={field.name}
                            suffix=" min"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <FormLabel className="flex items-center gap-2">
                      <CircleCheckBig size={14} /> Questões
                    </FormLabel>
                    <div className="flex flex-row items-start rounded-md border p-[9px] dark:border-muted">
                      <Controller
                        control={form.control}
                        name="questionStatus"
                        defaultValue={false}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                {(form.formState.errors.rightQuestions ||
                  form.formState.errors.wrongQuestions ||
                  form.formState.errors.questionsDurationSec) && (
                  <FormMessage className="text-xs font-light">
                    Os campos de questões são obrigatórios. Se não fez nenhuma,
                    coloque 0 (zero).
                  </FormMessage>
                )}
              </div>
              <div className="relative mt-2">
                <Label
                  htmlFor="studyMethod"
                  className="absolute -top-5 left-2 flex gap-1 rounded-t-lg border-s-[1px] border-t-[1px] bg-orange-50 p-2 dark:border-muted dark:bg-muted"
                >
                  <Brain size={14} />
                  Método
                </Label>

                <Input
                  className="mt-1 placeholder:text-xs placeholder:text-gray-300"
                  placeholder="80/20 - 20/80 - space retrival - etc..."
                  {...form.register('studyMethod')}
                  name="studyMethod"
                  id="studyMethod"
                />
                {errors.studyMethod && (
                  <div>
                    <p className="text-xs text-destructive">
                      {errors?.studyMethod?.message?.toString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="relative mt-2">
                <Label
                  htmlFor="notes"
                  className="absolute -top-5 left-2 flex gap-1 rounded-t-lg border-s-[1px] border-t-[1px] bg-orange-50 p-2 dark:border-muted dark:bg-muted"
                >
                  <ClipboardPenLine size={14} />
                  Observações
                </Label>

                <Textarea
                  className="mt-1 placeholder:text-xs placeholder:text-gray-300"
                  placeholder="Se preferir, adicione algumas observações sobre essa sessão de estudos que você executou"
                  rows={4}
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
