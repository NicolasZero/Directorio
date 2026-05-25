import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type DialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  children?: ReactNode
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export function Dialog({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  children,
  onClose,
  onConfirm,
  loading = false,
}: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/20 bg-white p-6 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="mb-4">{children}</div>}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? 'Espere...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
