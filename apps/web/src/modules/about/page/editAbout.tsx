import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Building2, FileText, Hammer, Handbag, Handshake, Heart, Mail, Medal, Plus, Scale, Shield, Trophy, User, X } from 'lucide-react'
import { useNavigate, Link } from 'react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import getIconComponent from '@/modules/about/hooks/useIconComponent'

const emptyValor = { titulo: '', descripcion: '', icono: '' }
const emptyLogro = { numero: '', titulo: '', descripcion: '' }
const emptyAliado = { nombre: '', tipo: '' }
const emptyRed = { nombre: '', url: '' }

export default function EditAbout() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [nombreCorto, setNombreCorto] = useState('')
  const [fechaCreacion, setFechaCreacion] = useState('')
  const [leyCreacion, setLeyCreacion] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [vision, setVision] = useState('')
  const [mision, setMision] = useState('')
  const [valores, setValores] = useState([emptyValor])
  const [nuevoValor, setNuevoValor] = useState({ titulo: '', descripcion: '', icono: '' })
  const [nuevoLogro, setNuevoLogro] = useState({ numero: '', titulo: '', descripcion: '' })
  const [logros, setLogros] = useState([emptyLogro])
  const [aliados, setAliados] = useState([emptyAliado])
  const [contacto, setContacto] = useState({ direccion: '', telefono: '', correo: '', horario: '' })
  const [redes, setRedes] = useState([emptyRed])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/about')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo cargar el curso')
        }

        setNombre(data.nombre || '')
        setNombreCorto(data.nombre_corto || '')
        setDescripcion(data.descripcion || '')
        setFechaCreacion(data.fecha_creacion || '')
        setLeyCreacion(data.ley_creacion || '')
        setVision(data.vision || '')
        setMision(data.mision || '')
        setValores(data.valores || '')
        setLogros(data.logros || '')
        setAliados(data.aliados || '') //Entes relacionados
        setContacto(data.contacto || '')
        setRedes(data.redes || '')
      } catch (fetchError) {
        console.error(fetchError)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [])

  const handleArrayChange = (setter: any, idx: number, field: string, value: string, arr: any[]) => {
    const copy = [...arr]
    copy[idx] = { ...copy[idx], [field]: value }
    setter(copy)
  }

  const addItem = (setter: any, sample: any, arr: any[]) => setter([...arr, { ...sample }])
  const removeItem = (setter: any, idx: number, arr: any[]) => setter(arr.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const payload = {
      nombre,
      nombreCorto,
      fechaCreacion,
      leyCreacion,
      descripcion,
      vision,
      mision,
      valores,
      logros,
      aliados,
      contacto,
      redes,
    }

    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      setMessage('Guardado correctamente')
    } catch (err: any) {
      setMessage('Error: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className='py-5' onSubmit={handleSubmit}>
      <header className="px-4 sm:px-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            Editar sección
          </Badge>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Editar datos de la institución</h1>
          <p className="mt-2 text-sm">Actualiza la información institucional.</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/about">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
        </Button>
      </header>

      <fieldset className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <header className="flex items-center gap-3 col-span-2">
          <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-rose-600 dark:text-rose-100" />
          </figure>
          <div>
            <h2 className="text-xl font-bold text-foreground">Información básica</h2>
            <p className="text-sm">Información general del centro</p>
          </div>
        </header>

        <label>
          <span className="text-sm">Nombre completo</span>
          <Input name='nombre' placeholder="Nombre" value={nombre} onChange={(e) => setNombre((e.target as HTMLInputElement).value)} />
        </label>

        <label>
          <span className="text-sm">Nombre corto</span>
          <Input name='nombre_corto' placeholder="Nombre corto" value={nombreCorto} onChange={(e) => setNombreCorto((e.target as HTMLInputElement).value)} />
        </label>

        <label>
          <span className="text-sm">Fecha de creación</span>
          <Input name='fecha_creacion' placeholder="Fecha de creación" value={fechaCreacion} onChange={(e) => setFechaCreacion((e.target as HTMLInputElement).value)} />
        </label>

        <label>
          <span className="text-sm">Ley de creación</span>
          <Input name='ley_creacion' placeholder="Ley de creación" value={leyCreacion} onChange={(e) => setLeyCreacion((e.target as HTMLInputElement).value)} />
        </label>

        <label className='col-span-2'>
          <span className="text-sm">Descripción</span>
          <Textarea
            placeholder="Descripción"
            name='descripcion'
            value={descripcion}
            onChange={(e) => setDescripcion((e.target as HTMLTextAreaElement).value)}
            className='bg-card'
          />
        </label>
      </fieldset>

      <fieldset className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30">
        <header className="flex items-center gap-3 col-span-2">
          <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-rose-600 dark:text-rose-100" />
          </figure>
          <h2 className="text-xl font-bold text-foreground">Misión y Visión</h2>
        </header>

        <label>
          <span className="text-sm">Visión</span>
          <Textarea
            placeholder="Visión"
            name='vision'
            value={vision}
            onChange={(e) => setVision((e.target as HTMLTextAreaElement).value)}
            className='bg-card'
          />
        </label>

        <label>
          <span className="text-sm">Misión</span>
          <Textarea
            placeholder="Misión"
            name='mision'
            value={mision}
            onChange={(e) => setMision((e.target as HTMLTextAreaElement).value)}
            className='bg-card'
          />
        </label>
      </fieldset>

      <fieldset className="py-8 px-4 sm:px-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className='space-y-4'>
          <header className="flex items-center gap-3 col-span-2">
            <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
              <Medal className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </figure>
            <h2 className="text-xl font-bold text-foreground">Valores</h2>
          </header>

          <Input placeholder="Título" value={nuevoValor.titulo} onChange={(e) => setNuevoValor({ ...nuevoValor, titulo: (e.target as HTMLInputElement).value })} />
          <Select value={nuevoValor.icono} onValueChange={(value) => setNuevoValor({ ...nuevoValor, icono: value })}>
            <SelectTrigger className="rounded-3xl px-4 py-3 w-full">
              <SelectValue placeholder="Icono" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Heart"><Heart size={20} /> Corazón</SelectItem>
              <SelectItem value="Shield"><Shield size={20} /> Escudo</SelectItem>
              <SelectItem value="Scale"><Scale size={20} /> Balanza</SelectItem>
              <SelectItem value="Hammer"><Hammer size={20} /> Mazo</SelectItem>
              <SelectItem value="Handshake"><Handshake size={20} /> Manos</SelectItem>
              <SelectItem value="Handbag"><Handbag size={20} /> Bolsa</SelectItem>
              <SelectItem value="User"><User size={20} /> Usuario</SelectItem>
              <SelectItem value="FileText"><FileText size={20} /> Archivo</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Descripción" name="descripcion" value={nuevoValor.descripcion} onChange={(e) => setNuevoValor({ ...nuevoValor, descripcion: (e.target as HTMLTextAreaElement).value })} className='bg-card' />
          <Button className='bg-rose-600 text-white' type="button" variant="ghost" size="sm" onClick={() => addItem(setValores, nuevoValor, valores)}>
            <Plus className='w-4 h-4 mr-2' /> Agregar
          </Button>

          {valores.map((v, i) => (
            <div key={i} className='flex items-center gap-2 border p-3 rounded-xl'>
              {getIconComponent(v.icono)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Input value={v.titulo} onChange={(e) => handleArrayChange(setValores, i, 'titulo', (e.target as HTMLInputElement).value, valores)} />
                  <Button className='text-rose-600 hover:bg-rose-600/10 hover:text-rose-800' type="button" variant="ghost" size="sm" onClick={() => removeItem(setValores, i, valores)}>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
                <Textarea value={v.descripcion} onChange={(e) => handleArrayChange(setValores, i, 'descripcion', (e.target as HTMLTextAreaElement).value, valores)} />
              </div>
            </div>
          ))}
        </div>

        <section className='space-y-4'>
          <header className="flex items-center gap-3 col-span-2">
            <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </figure>
            <h2 className="text-xl font-bold text-foreground">Logros</h2>
          </header>

          <Input placeholder="Título" value={nuevoLogro.titulo} onChange={(e) => setNuevoLogro({ ...nuevoLogro, titulo: (e.target as HTMLInputElement).value })} />
          <Input placeholder="Valor" value={nuevoLogro.numero} onChange={(e) => setNuevoLogro({ ...nuevoLogro, numero: (e.target as HTMLInputElement).value })} />
          <Textarea placeholder="Descripción" name="descripcion" value={nuevoLogro.descripcion} onChange={(e) => setNuevoLogro({ ...nuevoLogro, descripcion: (e.target as HTMLTextAreaElement).value })} />
          <Button className='bg-rose-600 text-white' type="button" variant="ghost" size='sm' onClick={() => addItem(setLogros, emptyLogro, logros)}>
            <Plus className='w-4 h-4 mr-2' />
            Agregar
          </Button>

          {logros.map((l, i) => (
            <div key={i} className='flex flex-col gap-2 border p-3 rounded-xl'>
              <div className="flex items-center justify-between">
                <Input value={l.numero} onChange={(e) => handleArrayChange(setLogros, i, 'numero', (e.target as HTMLInputElement).value, logros)} />
                <Button className='text-rose-600 hover:bg-rose-600/10 hover:text-rose-800' type="button" variant="ghost" size="sm" onClick={() => removeItem(setLogros, i, logros)}>
                  <X className='w-4 h-4' />
                </Button>
              </div>
              <Input value={l.titulo} onChange={(e) => handleArrayChange(setLogros, i, 'titulo', (e.target as HTMLInputElement).value, logros)} />
              <Textarea className='text-sm' value={l.descripcion} onChange={(e) => handleArrayChange(setLogros, i, 'descripcion', (e.target as HTMLTextAreaElement).value, logros)} />
            </div>
          ))}
        </section>
      </fieldset>

      {/* información de contacto */}
      <fieldset className='space-y-4 py-8 px-4 sm:px-8 bg-muted'>
        <header className="flex items-center gap-3 col-span-2">
          <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-rose-600 dark:text-rose-100" />
          </figure>
          <h2 className="text-xl font-bold text-foreground">Información de contacto</h2>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 py-3'>
          <label ><span className="text-sm font-medium">Dirección</span>
            <Input name='direccion' placeholder="Dirección" value={contacto.direccion} onChange={(e) => setContacto({ ...contacto, direccion: (e.target as HTMLInputElement).value })} />
          </label>

          <label ><span className="text-sm font-medium">Teléfono</span>
            <Input name='telefono' placeholder="Teléfono" value={contacto.telefono} onChange={(e) => setContacto({ ...contacto, telefono: (e.target as HTMLInputElement).value })} />
          </label>

          <label ><span className="text-sm font-medium">Correo</span>
            <Input name='correo' placeholder="Correo" value={contacto.correo} onChange={(e) => setContacto({ ...contacto, correo: (e.target as HTMLInputElement).value })} />
          </label>

          <label ><span className="text-sm font-medium">Horario</span>
            <Input name='horario' placeholder="Horario" value={contacto.horario} onChange={(e) => setContacto({ ...contacto, horario: (e.target as HTMLInputElement).value })} />
          </label>
        </div>
      </fieldset>

      {/* entidades relacionadas y redes sociales */}
      <fieldset className="py-8 px-4 sm:px-8 grid gap-10 lg:grid-cols-2">
        <section className='space-y-4'>
          <header className="flex items-center gap-3 col-span-2">
            <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </figure>
            <h2 className="text-xl font-bold text-foreground">Entes relacionados</h2>
          </header>
          {aliados.map((a, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Nombre" value={a.nombre} onChange={(e) => handleArrayChange(setAliados, i, 'nombre', (e.target as HTMLInputElement).value, aliados)} />
              <Input placeholder="Tipo" value={a.tipo} onChange={(e) => handleArrayChange(setAliados, i, 'tipo', (e.target as HTMLInputElement).value, aliados)} />
              <Button className='text-rose-600 hover:bg-rose-600/10 hover:text-rose-800' type="button" variant="ghost" size="sm" onClick={() => removeItem(setAliados, i, aliados)}><X className='w-4 h-4' /></Button>
            </div>
          ))}
          <Button className='bg-rose-600 text-white' type="button" variant="ghost" size="sm" onClick={() => addItem(setAliados, emptyAliado, aliados)}><Plus className='w-4 h-4 mr-2' /> Agregar aliado</Button>
        </section>

        <section className='space-y-4'>
          <header className="flex items-center gap-3 col-span-2">
            <figure className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </figure>
            <h2 className="text-xl font-bold text-foreground">Redes sociales</h2>
          </header>
          {redes.map((r, i) => (
            <div key={i} className="flex gap-2 items-center mt-2">
              <Input placeholder="Nombre" value={r.nombre} onChange={(e) => handleArrayChange(setRedes, i, 'nombre', (e.target as HTMLInputElement).value, redes)} />
              <Input placeholder="Url" value={r.url} onChange={(e) => handleArrayChange(setRedes, i, 'url', (e.target as HTMLInputElement).value, redes)} />
              <Button className='text-rose-600 hover:bg-rose-600/10 hover:text-rose-800' type="button" variant="ghost" size="sm" onClick={() => removeItem(setRedes, i, redes)}><X className='w-4 h-4' /></Button>
            </div>
          ))}
          <div className="mt-3">
            <Button className='bg-rose-600 text-white' type="button" variant="ghost" size="sm" onClick={() => addItem(setRedes, emptyRed, redes)}><Plus className='w-4 h-4 mr-2' /> Agregar red</Button>
          </div>
        </section>
      </fieldset>

      {/* botones de acción */}
      <fieldset className="p-4 space-x-4">
        <Button type="submit" className="rounded-3xl bg-rose-600 text-white hover:bg-rose-700" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/about')}>
          Volver sin guardar
        </Button>
        {message && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 mt-3 text-sm text-emerald-700">{message}</div>
        )}
      </fieldset>
    </form >
  )
}
