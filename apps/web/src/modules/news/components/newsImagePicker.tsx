import { useEffect, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadNewsImage } from '../utils/uploadNewsImage'

type NewsImage = {
  url: string
  updatedAt: string
}

type NewsImagePickerProps = {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function NewsImagePicker({ open, onClose, onSelect }: NewsImagePickerProps) {
  const [images, setImages] = useState<NewsImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    let cancelled = false

    const fetchImages = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/news/images')
        const result = await response.json()
        if (!response.ok) throw new Error(result?.error || 'No se pudieron cargar las imágenes.')
        if (!cancelled) setImages(result.data ?? [])
      } catch (fetchError) {
        console.error(fetchError)
        if (!cancelled) setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar las imágenes.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchImages()
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !uploading) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, uploading])

  const handleUpload = async (file?: File) => {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadNewsImage(file)
      onSelect(url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !uploading) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-image-picker-title"
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border bg-background p-5 shadow-2xl"
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="news-image-picker-title" className="text-xl font-semibold">Biblioteca de imágenes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Selecciona una imagen existente o sube una nueva.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose} disabled={uploading}>
            <X />
          </Button>
        </header>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{images.length} imagen{images.length === 1 ? '' : 'es'}</p>
          <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <ImagePlus className="h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Subir imagen'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                void handleUpload(event.currentTarget.files?.[0])
                event.currentTarget.value = ''
              }}
            />
          </label>
        </div>

        {error && <p className="mb-3 text-sm text-destructive" role="alert">{error}</p>}
        <div className="min-h-48 flex-1 overflow-y-auto">
          {loading ? (
            <p className="py-16 text-center text-muted-foreground">Cargando imágenes...</p>
          ) : images.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">Todavía no hay imágenes. Sube la primera.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  className="group overflow-hidden rounded-xl border text-left transition hover:border-rose-500 hover:ring-2 hover:ring-rose-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  onClick={() => onSelect(image.url)}
                >
                  <img src={image.url} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                  <span className="block truncate px-2 py-1.5 text-xs text-muted-foreground">
                    {new Date(image.updatedAt).toLocaleDateString('es')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
