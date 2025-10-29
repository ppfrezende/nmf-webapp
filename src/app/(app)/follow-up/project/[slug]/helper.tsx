// components/PageHelpDialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { useFirstVisit } from '@/hooks/projects/use-first-visit'

type Props = {
  id: string // ex.: pathname
  title: string
  description?: string
  children?: React.ReactNode // conteúdo rico (lista, imagem, etc.)
  showTrigger?: boolean // mostra o botão "Ajuda" na página
  version?: number
  ttlDays?: number
}

export function PageHelpDialog({
  id,
  title,
  description,
  children,
  showTrigger = true,
  version,
  ttlDays,
}: Props) {
  const { open, setOpen, markSeen } = useFirstVisit({ id, version, ttlDays })

  const handleClose = (next: boolean) => {
    setOpen(next)
    if (!next) markSeen()
  }

  return (
    <>
      {showTrigger && (
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2"
          onClick={() => setOpen(true)}
        >
          <Info className="size-12" />
          Ajuda
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="prose dark:prose-invert max-w-none">{children}</div>

          <DialogFooter className="mt-4">
            <Button onClick={() => handleClose(false)}>Entendi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
