import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import Login from '../components/loginForm.tsx'
import { ModeToggle } from "@/components/mode-toggle";
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/authContext.tsx'
import { useEffect } from 'react';

function Auth() {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'authenticated') {
      navigate('/admin', { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-100 dark:from-violet-950/50 via-white dark:via-black to-violet-100/50 dark:to-violet-950/50 py-6 px-4 md:px-6 md:py-12 mx-auto flex flex-col md:flex-row items-center md:gap-12">
      <section className="absolute top-4 right-4">
        <ModeToggle />
      </section>
      <section className="flex-1 max-w-2xl">
        <h1 className="text-4xl md:text-5xl text-center md:text-left font-bold mb-4 text-foreground">
          Bienvenida
        </h1>
        <div className="text-sm text-muted-foreground space-y-4">
          <p className="hidden md:block rounded-2xl border border-violet-200 bg-white/70 p-4 dark:border-violet-900 dark:bg-violet-950/40">
            Ingresa tu usuario y contraseña para continuar. Si no tienes cuenta, comunícate con el equipo de soporte.
          </p>
          <p className="rounded-2xl border border-violet-200 bg-white/70 p-4 dark:border-violet-900 dark:bg-violet-950/40">
            Tu información está protegida y solo se utiliza para acceder a tu perfil y servicios.
          </p>
        </div>
      </section>

      <section className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <figure className="absolute inset-0 bg-linear-to-r from-violet-400 to-violet-600 rounded-3xl rotate-6 opacity-20" />
          <Card className="relative overflow-hidden rounded-3xl shadow-2xl border-0">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-50 rounded-2xl">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
                  <CardDescription>Accede a tu cuenta INAMUJER</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <Login />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Auth
