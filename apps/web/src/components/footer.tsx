import { ArrowRight, Calendar, HandHeart, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

const institucion = {
    nombre: "Instituto Nacional de la Mujer",
    nombreCorto: "Inamujer",
    contacto: {
        direccion: "Av. Universidad, Edificio Inamujer, Caracas, Venezuela",
        telefono: "+58 212 555-1234",
        correo: "contacto@inamujer.gob.ve",
        horario: "Lunes a Viernes: 8:00 AM - 5:00 PM"
    },
    redesSociales: [
        { nombre: "Instagram", url: "#" },
        { nombre: "Facebook", url: "#" },
        { nombre: "Twitter", url: "#" },
        { nombre: "YouTube", url: "#" }
    ]
}

const Footer = () => {
    return (
        <footer className='p-4'>
            <Card className="bg-rose-600 dark:bg-rose-900 w-full sm:w-[90vw] m-auto">
                <CardContent className="p-6 md:p-8">
                    <header className="text-center mb-8 text-rose-100">
                        <HandHeart className="w-12 h-12 mx-auto mb-4 opacity-80" />
                        <h1 className="text-3xl font-bold mb-3">¿Necesitas Ayuda?</h1>
                        <p className="max-w-xl mx-auto">
                            Estamos aquí para apoyarte. Contáctanos mediante cualquiera de estos canales.
                        </p>
                    </header>

                    <main className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-rose-100">
                        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-rose-700 dark:bg-rose-950 transition-colors">
                            <MapPin className="h-8 w-8 mb-3" />
                            <h3 className="font-semibold mb-1">Dirección</h3>
                            <p className="text-sm">{institucion.contacto.direccion}</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-rose-700 dark:bg-rose-950 transition-colors">
                            <Phone className="h-8 w-8 mb-3" />
                            <h3 className="font-semibold mb-1">Teléfono</h3>
                            <p className="text-sm">{institucion.contacto.telefono}</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-rose-700 dark:bg-rose-950 transition-colors">
                            <Mail className="h-8 w-8 mb-3" />
                            <h3 className="font-semibold mb-1">Correo</h3>
                            <p className="text-sm">{institucion.contacto.correo}</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 rounded-lg bg-rose-700 dark:bg-rose-950 transition-colors">
                            <Calendar className="h-8 w-8 mb-3" />
                            <h3 className="font-semibold mb-1">Horario</h3>
                            <p className="text-sm">{institucion.contacto.horario}</p>
                        </div>
                    </main>

                    <footer className="text-center mt-8">
                        <Button className="" variant="outline" size="lg">
                            Contáctanos
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <p className="text-rose-100 text-center pt-4">© Copyright {new Date().getFullYear()} Inamujer. Oficina de Sistema y Tecnología de la Información</p>
                    </footer>
                </CardContent>
            </Card>
        </footer>
    )
}

export default Footer