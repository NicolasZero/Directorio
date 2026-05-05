import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Search } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import DirectoryCard from '../components/directoryCard'

// Tipo para los datos del directorio
interface DirectoryEntry {
	id: number
	nombre: string
	direccion: string
	telefono: string
	foto?: string
	municipio: string
	estado: string
}

// Datos de prueba (simulando respuesta de base de datos)
const directoriosData: DirectoryEntry[] = [
	// Caracas
	{
		id: 1,
		nombre: 'Centro de Atención Inamujer Caracas',
		direccion: 'Av. Universidad, Edificio Centro, Piso 1, Caracas',
		telefono: '(0212) 555-1234',
		municipio: 'Libertador',
		estado: 'Caracas',
	},
	{
		id: 2,
		nombre: 'Oficina Atención Mujer Libertador',
		direccion: 'Plaza Bolívar, Caracas',
		telefono: '(0212) 555-5678',
		municipio: 'Libertador',
		estado: 'Caracas',
	},
	// Miranda
	{
		id: 3,
		nombre: 'Centro Inamujer Chacao',
		direccion: 'Av. principal de Chacao, Caracas',
		telefono: '(0212) 555-9012',
		foto: './uh_eto_bleh.png',
		municipio: 'Chacao',
		estado: 'Miranda',
	},
	{
		id: 4,
		nombre: 'Atención a la Mujer Cristobal Rojas',
		direccion: 'Calle principal, Charallave',
		telefono: '(0212) 555-3456',
		municipio: 'Cristobal Rojas',
		estado: 'Miranda',
	},
	{
		id: 5,
		nombre: 'Centro de la Mujer Miranda',
		direccion: 'Av. principal de Los Tilos, Miranda',
		telefono: '(0212) 555-7890',
		municipio: 'Chacao',
		estado: 'Miranda',
	},
	// Aragua
	{
		id: 6,
		nombre: 'Instituto Nacional de la Mujer Aragua',
		direccion: 'Av. Bolívar, Maracay, Estado Aragua',
		telefono: '(0243) 555-1111',
		municipio: 'Girardot',
		estado: 'Aragua',
	},
	{
		id: 7,
		nombre: 'Centro de Atención Aragua',
		direccion: 'Centro de Maracay, Aragua',
		telefono: '(0243) 555-2222',
		municipio: 'Girardot',
		estado: 'Aragua',
	},
	// Zulia
	{
		id: 8,
		nombre: 'Inamujer Zulia',
		direccion: 'Av. 5 de Julio, Maracaibo',
		telefono: '(0261) 555-3333',
		municipio: 'Maracaibo',
		estado: 'Zulia',
	},
	{
		id: 9,
		nombre: 'Centro de la Mujer Zuliana',
		direccion: 'Calle 72, Maracaibo',
		telefono: '(0261) 555-4444',
		municipio: 'Maracaibo',
		estado: 'Zulia',
	},
	// Lara
	{
		id: 10,
		nombre: 'Inamujer Lara',
		direccion: 'Av. Lara, Barquisimeto',
		telefono: '(0251) 555-5555',
		municipio: 'Iribarren',
		estado: 'Lara',
	},
]

const listStates: string[] = [
	"Caracas",
	"Miranda",
	"Aragua",
	"Bolívar",
	"Trujillo",
	"Zulia",
	"Falcón",
	"Mérida",
	"Apure",
	"Táchira",
	"Anzoátegui",
	"Barinas",
	"Cojedes",
	"Delta Amacuro",
	"Guárico",
	"Lara",
	"Monagas",
	"Portuguesa",
	"Sucre",
	"Yaracuy",
	"Amazonas",
	"Nueva Esparta",
	"Dependencias Federales"
]

const listMunicipalities: Record<string, string[]> = {
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


function Directory() {
	const [selectedState, setSelectedState] = useState<string>('')
	const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')

	const handleSelectState = (value: string) => {
		setSelectedState(value)
		setSelectedMunicipality('')
	}

	const handleSelectMunicipality = (value: string) => {
		setSelectedMunicipality(value)
	}

	// Filtrar directorios según selección
	const filteredDirectorios = directoriosData.filter((item) => {
		const matchesState = selectedState ? item.estado === selectedState : true
		const matchesMunicipality = selectedMunicipality ? item.municipio === selectedMunicipality : true
		return matchesState && matchesMunicipality
	})

	return (
		<div className="min-h-screen">
			<section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-4 md:py-10 px-4">

				<div className="container mx-auto text-center max-w-2xl">
					<Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
						<Search className="w-3 h-3 mr-1" />
						Directorio
					</Badge>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
						Encuentra <span className="text-rose-600">Centros de Atención</span>
					</h1>
					<p className="text-lg text-muted-foreground mb-6">
						Explora los centros de atención disponibles en todo el país.
					</p>

					{/* Stats */}
					<div className="flex justify-center gap-8 md:gap-12">
						<div className="text-center">
							<p className="text-3xl font-bold text-rose-600">{directoriosData.length}</p>
							<h5 className="text-sm text-muted-foreground">Centros</h5>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-rose-600">
								{new Set(directoriosData.map(d => d.estado)).size}
							</p>
							<h5 className="text-sm text-muted-foreground">Estados</h5>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-rose-600">
								{new Set(directoriosData.map(d => d.municipio)).size}
							</p>
							<h5 className="text-sm text-muted-foreground">Municipios</h5>
						</div>
					</div>
				</div>

			</section>

			{/* Selecionadores de estado */}
			<section className="flex justify-center gap-5 mt-6 flex-wrap p-2">
				<Select value={selectedState} onValueChange={handleSelectState}>
					<SelectTrigger className="w-full max-w-48">
						<SelectValue placeholder="Seleccione un Estado" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Estados</SelectLabel>
							{
								listStates && listStates.map((state: string) => (
									<SelectItem key={state} value={state}>
										{state}
									</SelectItem>
								))
							}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select value={selectedMunicipality} onValueChange={handleSelectMunicipality} disabled={!selectedState}>
					<SelectTrigger className="w-full max-w-50">
						<SelectValue placeholder="Seleccione un municipio" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Municipios</SelectLabel>
							{
								selectedState && listMunicipalities[selectedState] &&
								listMunicipalities[selectedState].map((municipality: string) => (
									<SelectItem key={municipality} value={municipality}>
										{municipality}
									</SelectItem>
								))
							}
						</SelectGroup>
					</SelectContent>
				</Select>
			</section>

			{/* Results Section */}
			<section className="p-4 md:px-8">
				{selectedState ? (
					<>
						<header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
							<div>
								<h2 className="text-2xl font-bold">
									{`Directorios en ${selectedState} ${selectedMunicipality ? `- ${selectedMunicipality}` : ''}`}
								</h2>
								<p className="text-muted-foreground mt-1">
									{filteredDirectorios.length} resultado
									{filteredDirectorios.length !== 1 ? 's' : ''} encontrado
									{filteredDirectorios.length !== 1 ? 's' : ''}
								</p>
							</div>
							{selectedMunicipality && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setSelectedMunicipality('')}
								>
									Ver todos los municipios
								</Button>
							)}
						</header>

						{filteredDirectorios.length > 0 ? (
							<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredDirectorios.map((directorio) => (
									<DirectoryCard key={directorio.id} directorio={directorio} />
								))}
							</main>
						) : (
							<Card className="max-w-md mx-auto">
								<CardContent className="p-8 text-center">
									<div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mx-auto mb-4">
										<Search className="w-8 h-8 text-rose-600 dark:text-rose-100" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										No se encontraron directorios
									</h3>
									<p className="text-muted-foreground mb-4">
										Intenta seleccionar un estado o municipio diferente
									</p>
									<Button
										variant="outline"
										onClick={() => {
											setSelectedState('')
											setSelectedMunicipality('')
										}}
									>
										Ver todos los estados
									</Button>
								</CardContent>
							</Card>
						)}
					</>
				) : (
					<div className="text-center py-5">
						<div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mx-auto mb-6">
							<MapPin className="w-10 h-10 text-rose-600 dark:text-rose-100" />
						</div>
						<h3 className="text-xl font-semibold mb-2">
							Selecciona un Estado
						</h3>
						<p className="text-muted-foreground max-w-md mx-auto mb-4">
							Elige un estado para ver los centros de atención disponibles en esa zona.
						</p>
						<div className="flex flex-wrap justify-center gap-2">
							{directoriosData.map(d => d.estado).filter((v, i, a) => a.indexOf(v) === i).map(estado => (
								<Badge
									key={estado}
									variant="outline"
									className="cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 dark:hover:text-rose-500 dark:hover:bg-background dark:hover:border-rose-500 transition-colors"
									onClick={() => handleSelectState(estado)}
								>
									{estado}
								</Badge>
							))}
						</div>
					</div>
				)}
			</section>
		</div>
	)
}

export default Directory