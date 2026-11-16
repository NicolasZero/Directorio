import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Newspaper } from 'lucide-react'
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
    return <p className="py-16 text-center text-muted-foreground">Cargando noticia...</p>
  }

  return (
    <section className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            <Newspaper className="mr-1 h-3 w-3" />
            {isEdit ? 'Editar noticia' : 'Nueva noticia'}
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">{isEdit ? 'Editar noticia' : 'Crear noticia'}</h1>
          <p className="mt-2 text-muted-foreground">
            {isEdit ? 'Actualiza la información y el estado de la noticia.' : 'Completa los datos para guardar la noticia como borrador.'}
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/noticias"><ArrowLeft className="mr-2 h-4 w-4" />Volver a noticias</Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="py-4 text-destructive" role="alert">{error}</CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Contenido de la noticia</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Título</label>
              <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={200} />
            </div>
            <div className="space-y-2">
              <label htmlFor="summary" className="text-sm font-medium">Resumen</label>
              <textarea
                id="summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                rows={3}
                className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido del artículo</label>
              <NewsRichTextEditor
                value={content}
                onChange={setContent}
              />
            </div>
            {isEdit && user?.role === 'Administrador' && (
              <div className="space-y-2">
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
                <p className="text-sm text-muted-foreground">
                  Los borradores solo son visibles para administradores.
                </p>
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                <Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} maxLength={100} />
              </div>
              <div className="space-y-2">
                <label htmlFor="publishedAt" className="text-sm font-medium">Fecha de publicación</label>
                <Input
                  id="publishedAt"
                  type="date"
                  value={publishedAt}
                  onChange={(event) => setPublishedAt(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3 rounded-xl border p-4">
              <div>
                <h3 className="text-sm font-semibold">Imagen de portada</h3>
                <p className="text-sm text-muted-foreground">Sube una imagen o pega una URL. Formatos JPG, PNG, WEBP o GIF; máximo 5 MB.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="image"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="https://... o /api/news/images/..."
                  aria-label="URL de imagen de portada"
                  className="min-w-56 flex-1"
                />
                <Button type="button" variant="outline" onClick={() => setImagePickerOpen(true)}>
                  Seleccionar imagen
                </Button>
                {image && (
                  <Button type="button" variant="outline" onClick={() => setImage('')}>
                    Quitar portada
                  </Button>
                )}
              </div>
              {image && (
                <img
                  src={image}
                  alt="Vista previa de la imagen de portada"
                  className="max-h-64 w-full rounded-lg object-cover"
                />
              )}
            </div>
            <NewsImagePicker
              open={imagePickerOpen}
              onClose={() => setImagePickerOpen(false)}
              onSelect={(url) => {
                setImage(url)
                setImagePickerOpen(false)
              }}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" asChild><Link to="/admin/noticias">Cancelar</Link></Button>
          <Button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700">
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar como borrador'}
          </Button>
        </div>
      </form>
    </section>
  )
}
