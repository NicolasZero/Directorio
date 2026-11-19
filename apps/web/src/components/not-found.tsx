import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BackArrowButton from '@/components/backArrowButton'
import { AlertTriangle } from "lucide-react"

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-100 via-white to-rose-100/50 dark:bg-linear-to-br dark:from-rose-950 dark:via-black/50 dark:to-rose-950/50 px-4 py-10">
      <Card className="w-full max-w-3xl rounded-[2rem] border-0 bg-neutral-50 shadow-2xl dark:bg-neutral-900">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full p-2 bg-rose-100 text-rose-600 border dark:bg-rose-900 dark:text-rose-100">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
              Error 404
            </Badge>
          </div>
          <CardTitle className="text-4xl text-background-foreground font-bold">Página no encontrada</CardTitle>
          <CardDescription className="mt-3 text-muted-foreground max-w-2xl">
            La ruta que buscas no existe o ya no está disponible. Regresa a la página principal y continúa explorando nuestros recursos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl bg-rose-50 dark:bg-muted p-6 text-center">
            <p className="text-2xl font-semibold text-rose-600 dark:text-rose-100 mb-3">Ups, parece que te perdiste.</p>
            <BackArrowButton to="/" replace ariaLabel="Volver al inicio" className="mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
