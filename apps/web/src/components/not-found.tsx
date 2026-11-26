import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router"

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-100 via-white to-violet-100/50 dark:bg-linear-to-br dark:from-violet-950 dark:via-black/50 dark:to-violet-950/50 px-4 py-10">
      <Card className="w-full max-w-3xl rounded-[2rem] border-0 bg-neutral-50 shadow-2xl dark:bg-neutral-900">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full p-2 bg-violet-100 text-violet-600 border dark:bg-violet-900 dark:text-violet-100">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <Badge variant="outline" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-100">
              Error 404
            </Badge>
          </div>
          <CardTitle className="text-4xl text-background-foreground font-bold">Página no encontrada</CardTitle>
          <CardDescription className="mt-3 text-muted-foreground max-w-2xl">
            La ruta que buscas no existe o ya no está disponible. Regresa a la página principal y continúa explorando nuestros recursos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl bg-violet-50 dark:bg-muted p-6 text-center">
            <p className="text-2xl font-semibold text-violet-600 dark:text-violet-100 mb-3">Ups, parece que te perdiste.</p>
            <Button asChild size="lg" className="bg-violet-600 text-violet-100 hover:bg-violet-800! dark:bg-violet-900 dark:hover:bg-violet-800">
              <Link to="/" replace>
                Volver al inicio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
