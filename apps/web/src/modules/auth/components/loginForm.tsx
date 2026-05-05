import { type SubmitEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      })

      const data = await response.json()
      setLoading(false)

      if (!response.ok) {
        setError(data?.error || 'Ocurrió un error al iniciar sesión.')
        return
      }

      setMessage('Inicio de sesión exitoso. Redirigiendo...')
      setTimeout(() => {
        navigate('/')
      }, 800)
    } catch (err) {
      setLoading(false)
      setError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-foreground">
          Usuario
        </label>
        {/* <input
          id="username"
          type="text"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          placeholder="Ingresa tu usuario"
          className="w-full rounded-3xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
          required
        /> */}
        <Input
          id="username"
          type="text"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          placeholder="Ingresa tu usuario"
          className="w-full rounded-3xl border border-input !bg-background h-12 px-4 text-sm text-foreground outline-none transition-colors focus:!border-rose-500 focus:!ring-2 focus:!ring-rose-500/20"
          required
        />
      </fieldset>

      <fieldset className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Contraseña
        </label>
        {/* <input
          id="password"
          type="password"
          value={pass}
          onChange={(event) => setPass(event.target.value)}
          placeholder="Ingresa tu contraseña"
          className="w-full rounded-3xl border border-input !bg-background h-12 px-4 text-sm text-foreground outline-none transition-colors focus:!border-rose-500 focus:!ring-2 focus:!ring-rose-500/20"
          required
        /> */}
        <Input
          id="password"
          type="password"
          value={pass}
          onChange={(event) => setPass(event.target.value)}
          placeholder="Ingresa tu contraseña"
          className="w-full rounded-3xl border border-input !bg-background h-12 px-4 text-sm text-foreground outline-none transition-colors focus:!border-rose-500 focus:!ring-2 focus:!ring-rose-500/20"
          required
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <Button type="submit" className="rounded-3xl bg-rose-600 dark:bg-rose-900 dark:hover:bg-rose-800 text-white hover:bg-rose-700" disabled={loading}>
          {loading ? 'Validando...' : 'Iniciar sesión'}
        </Button>
        <button
          type="button"
          onClick={() => setMessage('Por favor ingresa tus credenciales para continuar.')}
          className="text-sm text-rose-600 hover:text-rose-700"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </fieldset>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 text-red-700 dark:text-red-400 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:text-emerald-50 dark:border-emerald-800 dark:bg-emerald-900 px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}
    </form>
  )
}

export default Login
