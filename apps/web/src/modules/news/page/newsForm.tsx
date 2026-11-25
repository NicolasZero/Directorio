import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AlertCircle, ArrowLeft, CalendarDays, FileText, ImagePlus, Newspaper, Save, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/authContext'
import NewsImagePicker from '../components/newsImagePicker'
import NewsRichTextEditor from '../components/newsRichTextEditor'
import { newsHtmlHasText, sanitizeNewsHtml } from '../utils/newsContent'
import type { NewsEntry } from '../types/news'

function localDateValue() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

export default function NewsForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [image, setImage] = useState('')
  const [status, setStatus] = useState<'Borrador' | 'Publicado'>('Borrador')
  const [publishedAt, setPublishedAt] = useState(localDateValue)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/manage/${id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.error || 'No se pudo cargar la noticia.')
        }

        const item: NewsEntry = result.data
        if (!cancelled) {
          setTitle(item.title || '')
          setSummary(item.summary || '')
          setContent(sanitizeNewsHtml(item.content || ''))
          setCategory(item.category || 'General')
          setImage(item.image || '')
          setStatus(item.status === 'Publicado' ? 'Publicado' : 'Borrador')
          setPublishedAt(item.published_at ? item.published_at.slice(0, 10) : '')
        }
      } catch (fetchError) {
        console.error(fetchError)
        if (!cancelled) setError('No se pudo cargar la noticia. Intenta de nuevo más tarde.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchNews()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!newsHtmlHasText(content)) {
      setError('Agrega contenido antes de guardar la noticia.')
      return
    }
    setSaving(true)

    try {
      const response = await fetch(isEdit ? `/api/news/${id}` : '/api/news', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          category: category.trim() || 'General',
          image: image.trim() || null,
          publishedAt: publishedAt || null,
          ...(isEdit && user?.role === 'Administrador' ? { status } : {}),
        }),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error || `No se pudo ${isEdit ? 'actualizar' : 'crear'} la noticia.`)
        return
      }

      navigate('/admin/noticias')
    } catch (submitError) {
      console.error(submitError)
      setError('Ocurrió un error al comunicarse con la API.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <p className="rounded-2xl border bg-card px-6 py-12 text-center text-muted-foreground shadow-sm">
          Cargando noticia...
        </p>
      </div>
    )
  }

  return (
    <section className="min-h-full bg-muted/20 pb-10">
      <div className="border-b bg-linear-to-br from-rose-50 via-background to-background dark:from-rose-950/30">
        <div className="container mx-auto flex max-w-6xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:py-9">
          <div className="min-w-0">
            <Badge variant="outline" className="mb-3 border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
              <Newspaper className="mr-1.5 h-3.5 w-3.5" />
              {isEdit ? 'Edición' : 'Gestión de noticias'}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {isEdit ? 'Editar noticia' : 'Crear noticia'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {isEdit
                ? 'Actualiza el contenido, la portada y los detalles de esta noticia.'
                : 'Prepara una nueva noticia. Se guardará como borrador para que puedas revisarla antes de publicarla.'}
            </p>
          </div>
          <Button asChild variant="outline" className="w-full shrink-0 bg-background/80 sm:w-auto">
            <Link to="/admin/noticias"><ArrowLeft className="mr-2 h-4 w-4" />Regresar</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5 shadow-sm">
            <CardContent className="flex items-start gap-3 py-4 text-sm text-destructive" role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <Card className="min-w-0 overflow-hidden shadow-sm">
              <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-lg">Contenido de la noticia</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">Escribe un título, un resumen y el artículo completo.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-5 py-6 sm:px-7">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="title" className="text-sm font-semibold">Título <span className="text-destructive">*</span></label>
                    <span className="text-xs text-muted-foreground">{title.length}/200</span>
                  </div>
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    maxLength={200}
                    placeholder="Escribe un título claro y atractivo"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="summary" className="text-sm font-semibold">Resumen <span className="text-destructive">*</span></label>
                  <textarea
                    id="summary"
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    rows={4}
                    placeholder="Describe brevemente de qué trata la noticia..."
                    className="min-h-28 w-full resize-y rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Este texto ayuda a las personas a decidir si quieren leer el artículo.</p>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-semibold">Contenido del artículo <span className="text-destructive">*</span></label>
                    <p className="mt-1 text-xs text-muted-foreground">Usa la barra de herramientas para dar formato al texto.</p>
                  </div>
                  <NewsRichTextEditor value={content} onChange={setContent} />
                </div>
              </CardContent>
            </Card>

            <aside className="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <Card className="min-w-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-rose-600" />
                    <CardTitle className="text-base">Detalles</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Organiza y programa la noticia.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      maxLength={100}
                      placeholder="Ej. Comunidad"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="publishedAt" className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      Fecha de publicación
                    </label>
                    <Input
                      id="publishedAt"
                      type="date"
                      value={publishedAt}
                      onChange={(event) => setPublishedAt(event.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Puedes cambiar la fecha antes de guardar.</p>
                  </div>
                  {isEdit && user?.role === 'Administrador' && (
                    <div className="space-y-2 border-t pt-5">
                      <label htmlFor="status" className="text-sm font-medium">Estado de publicación</label>
                      <select
                        id="status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as 'Borrador' | 'Publicado')}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="Borrador">Borrador</option>
                        <option value="Publicado">Publicado</option>
                      </select>
                      <p className="text-xs text-muted-foreground">Los borradores solo son visibles para administradores.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-0 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-rose-600" />
                    <CardTitle className="text-base">Imagen de portada</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">JPG, PNG, WEBP o GIF; máximo 5 MB.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {image ? (
                    <div className="relative overflow-hidden rounded-xl border bg-muted">
                      <img
                        src={image}
                        alt="Vista previa de la imagen de portada"
                        className="aspect-video w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-2 shadow-sm"
                        onClick={() => setImage('')}
                      >
                        Quitar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed bg-muted/30 text-muted-foreground">
                      <div className="text-center">
                        <ImagePlus className="mx-auto mb-2 h-7 w-7 opacity-60" />
                        <p className="text-xs">Sin imagen seleccionada</p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="image"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="Pega aquí la URL de una imagen"
                    aria-label="URL de imagen de portada"
                    className="min-w-0"
                  />
                  <Button type="button" variant="outline" className="w-full" onClick={() => setImagePickerOpen(true)}>
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Seleccionar o subir imagen
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border bg-background/95 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              {isEdit ? 'Los cambios se guardarán en esta noticia.' : 'La noticia se guardará como borrador.'}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/admin/noticias">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={saving} className="w-full bg-rose-600 hover:bg-rose-700 sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar como borrador'}
              </Button>
            </div>
          </div>

          <NewsImagePicker
            open={imagePickerOpen}
            onClose={() => setImagePickerOpen(false)}
            onSelect={(url) => {
              setImage(url)
              setImagePickerOpen(false)
            }}
          />
        </form>
      </div>
    </section>
  )
}
