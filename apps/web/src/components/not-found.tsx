import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Link } from "react-router"

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-100 via-white to-rose-100/50 px-4 py-10">
      <Card className="w-full max-w-3xl rounded-[2rem] border-0 bg-neutral-50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full p-2 bg-rose-100 text-rose-600 border">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <Badge variant="outline" className="bg-rose-100 text-rose-700">
              Error 404
            </Badge>
          </div>
          <CardTitle className="text-4xl text-black font-bold">Página no encontrada</CardTitle>
          <CardDescription className="mt-3 text-black max-w-2xl">
            La ruta que buscas no existe o ya no está disponible. Regresa a la página principal y continúa explorando nuestros recursos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl bg-rose-50 p-6 text-center">
            <p className="text-2xl font-semibold text-rose-600 mb-3">Ups, parece que te perdiste.</p>
            <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-800! text-white hover:text-white">
              <Link to="/">
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
