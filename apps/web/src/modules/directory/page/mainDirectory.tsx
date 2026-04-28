import { useState } from 'react'
import { DirectoryLayout } from '../directoryLayout.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, User } from 'lucide-react'

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
		<>
			<DirectoryLayout
				selectedState={selectedState}
				handleSelectState={handleSelectState}
				selectedMunicipality={selectedMunicipality}
				handleSelectMunicipality={handleSelectMunicipality}
			>
				<div className="container mx-auto py-6 px-4">
					{selectedState ? (
						<div>
							<div className="mb-6">
								<h2 className="text-xl font-semibold text-center">
									{selectedMunicipality
										? `Directorios en ${selectedMunicipality}, ${selectedState}`
										: `Directorios en ${selectedState}`}
								</h2>
								<p className="text-center text-muted-foreground mt-1">
									{filteredDirectorios.length} resultado
									{filteredDirectorios.length !== 1 ? 's' : ''} encontrado
									{filteredDirectorios.length !== 1 ? 's' : ''}
								</p>
							</div>

							{filteredDirectorios.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{filteredDirectorios.map((directorio) => (
										<Card
											key={directorio.id}
											className="hover:shadow-lg transition-shadow duration-200"
										>
											<CardHeader className="pb-3">
												<div className="flex items-start gap-4">
													{directorio.foto ? (
														<img
															src={directorio.foto}
															alt={directorio.nombre}
															className="w-16 h-16 rounded-full object-cover border-2 border-primary"
														/>
													) : (
														<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
															<User className="w-8 h-8 text-primary" />
														</div>
													)}
													<div className="flex-1 min-w-0">
														<CardTitle className="text-lg leading-tight">
															{directorio.nombre}
														</CardTitle>
														<CardDescription className="mt-1">
															{directorio.municipio}, {directorio.estado}
														</CardDescription>
													</div>
												</div>
											</CardHeader>
											<CardContent className="pt-0">
												<div className="space-y-2">
													<div className="flex items-start gap-2 text-sm">
														<MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
														<span className="text-muted-foreground">
															{directorio.direccion}
														</span>
													</div>
													<div className="flex items-center gap-2 text-sm">
														<Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
														<a
															href={`tel:${directorio.telefono}`}
															className="text-primary hover:underline"
														>
															{directorio.telefono}
														</a>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<p className="text-lg text-muted-foreground">
										No se encontraron directorios en esta ubicación
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Intenta seleccionar un municipio diferente
									</p>
								</div>
							)}
						</div>
					) : (
						<div className="text-center py-12">
							<div className="mb-4">
								<MapPin className="w-16 h-16 mx-auto text-muted-foreground/30" />
							</div>
							<p className="text-lg text-muted-foreground">
								Selecciona un estado para ver los directorios disponibles
							</p>
							<p className="text-sm text-muted-foreground mt-2">
								Puedes filtrar aún más seleccionando un municipio
							</p>
						</div>
					)}
				</div>
			</DirectoryLayout>
		</>
	)
}

export default Directory