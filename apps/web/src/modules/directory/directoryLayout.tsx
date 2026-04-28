import type { ReactNode, FC } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    children: ReactNode
    selectedState: string | undefined
    handleSelectState: (value: string) => void
    selectedMunicipality: string | undefined
    handleSelectMunicipality: (value: string) => void
}

const states: Record<string, string[]> = {
    Caracas: [
        "Libertador"
    ],
    Miranda: [
        "Cristobal Rojas",
        "Chacao",
        "Baruta",
        "Sucre",
        "El Hatillo"
    ],
    Aragua: [
        "Girardot",
        "Mario Briceño Iragorry",
        "Santiago Mariño",
        "José Angel Lamas",
        "San Sebastián"
    ],
    Zulia: [
        "Maracaibo",
        "San Francisco",
        "Cabimas",
        "Lagunillas",
        "Machiques"
    ],
    Lara: [
        "Iribarren",
        "Morán",
        "Jiménez",
        "Torres",
        "Carora"
    ],
    Bolívar: [
        "Caroní",
        "Heres",
        "Padre Pedro Chien",
        "Angostura",
        "El Callao"
    ],
    Trujillo: [
        "Trujillo",
        "Boconó",
        "Valera",
        "Carache",
        "Escuque"
    ],
    Mérida: [
        "Libertador",
        "Campo Elias",
        "Tovar",
        "Santos Michelena",
        "Alberto Adriani"
    ],
    Táchira: [
        "San Cristóbal",
        "Rubio",
        "Capacho Nuevo",
        "Ayacucho",
        "Córdoba"
    ],
    Anzoátegui: [
        "Barcelona",
        "Puerto La Cruz",
        "Anaco",
        "Cantaura",
        "Soledad"
    ],
    Barinas: [
        "Barinas",
        "Barinas",
        "Alberto Arvelo Torrealba",
        "Antonio José de Sucre",
        "Cruz Paredes"
    ],
    Falcón: [
        "Coro",
        "Punto Fijo",
        "Carirubana",
        "Silva",
        "Los Taques"
    ],
    Monagas: [
        "Maturín",
        "Acosta",
        "Cedeño",
        "Esequibo",
        "Libertador"
    ],
    Portuguesa: [
        "Acarigua",
        "Guanare",
        "Araure",
        "Ospino",
        "Páez"
    ],
    Sucre: [
        "Cumaná",
        "Cumanacoa",
        "Carúpano",
        "Güiria",
        "Ribero"
    ],
    Yaracuy: [
        "San Felipe",
        "Chivacoa",
        "Aroa",
        "Nirgua",
        "Yaritagua"
    ],
    Guárico: [
        "San Juan de los Morros",
        "Calabozo",
        "Valle de la Pascua",
        "Altagracia de Orituco",
        "Tucupido"
    ],
    Cojedes: [
        "San Carlos",
        "Tinaquillo",
        "La Arena",
        "Guanare",
        "Paez"
    ],
    Apure: [
        "San Fernando de Apure",
        "Achaguas",
        "Biruaca",
        "Guasdualito",
        "Elorza"
    ],
    Amazonas: [
        "Puerto Ayacucho",
        "Atures",
        "Autana",
        "Manapiare",
        "Maroa"
    ],
    "Delta Amacuro": [
        "Tucupita",
        "Antonio Díaz",
        "Casacoima",
        "Pedernales",
        "Serranal"
    ],
    "Nueva Esparta": [
        "La Asunción",
        "Margarita",
        "Gómez",
        "Maneiro",
        "Peninsula de Macanao"
    ],
    "Dependencias Federales": [
        "Los Roques",
        "Los Monjes",
        "Isla La Tortuga",
        "Islas Las Aves",
        "Isla La Sola"
    ]
}

export const DirectoryLayout: FC<Props> = ({ children, selectedState, handleSelectState, selectedMunicipality, handleSelectMunicipality }) => {
    return (
        <>
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Directorio de Inamujer</h1>

            <div className="flex flex-wrap justify-center gap-2 my-2">

                <Select value={selectedState} onValueChange={handleSelectState}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Seleccione un Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Estados</SelectLabel>
                            <SelectItem value="Caracas">Caracas</SelectItem>
                            <SelectItem value="Miranda">Miranda</SelectItem>
                            <SelectItem value="Aragua">Aragua</SelectItem>
                            <SelectItem value="Bolívar">Bolívar</SelectItem>
                            <SelectItem value="Trujillo">Trujillo</SelectItem>
                            <SelectItem value="Zulia">Zulia</SelectItem>
                            <SelectItem value="Falcón">Falcón</SelectItem>
                            <SelectItem value="Mérida">Mérida</SelectItem>
                            <SelectItem value="Apure">Apure</SelectItem>
                            <SelectItem value="Táchira">Táchira</SelectItem>
                            <SelectItem value="Anzoátegui">Anzoátegui</SelectItem>
                            <SelectItem value="Barinas">Barinas</SelectItem>
                            <SelectItem value="Cojedes">Cojedes</SelectItem>
                            <SelectItem value="Delta Amacuro">Delta Amacuro</SelectItem>
                            <SelectItem value="Guárico">Guárico</SelectItem>
                            <SelectItem value="Lara">Lara</SelectItem>
                            <SelectItem value="Monagas">Monagas</SelectItem>
                            <SelectItem value="Portuguesa">Portuguesa</SelectItem>
                            <SelectItem value="Sucre">Sucre</SelectItem>
                            <SelectItem value="Yaracuy">Yaracuy</SelectItem>
                            <SelectItem value="Amazonas">Amazonas</SelectItem>
                            <SelectItem value="Nueva Esparta">Nueva Esparta</SelectItem>
                            <SelectItem value="Dependencias Federales">Dependencias Federales</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={selectedMunicipality} onValueChange={handleSelectMunicipality} disabled={!selectedState}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Seleccione un municipio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Municipios</SelectLabel>
                            {
                                selectedState && states[selectedState] &&
                                states[selectedState].map((municipality: string) => (
                                    <SelectItem key={municipality} value={municipality}>
                                        {municipality}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {children}
        </div>
        </>
    )
}