import { useState, useEffect } from 'react'
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
import { type DirectoryEntry } from '../schemes/directory'
import { useLocations } from '../hooks/useLocations'

function Directory() {
	const [directories, setDirectories] = useState<DirectoryEntry[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const { listStates, listMunicipalities, loadingLocation } = useLocations()

	const [selectedState, setSelectedState] = useState<string>('')
	const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')

	const handleSelectState = (value: string) => {
		setSelectedState(value)
		setSelectedMunicipality('')
	}

	const handleSelectMunicipality = (value: string) => {
		setSelectedMunicipality(value)
	}

	useEffect(() => {
		const fetchDirectories = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch('/api/directory')
				const data = await response.json()

				if (!response.ok) {
					throw new Error(data?.error || 'Error al cargar directorios')
				}

				setDirectories(data?.data || [])
			} catch (fetchError) {
				console.error(fetchError)
				setError('No se pudieron cargar los directorios. Intenta de nuevo más tarde.')
			} finally {
				setLoading(false)
			}
		}

		fetchDirectories()
	}, [])

	const filteredDirectorios = directories.filter((item) => {
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
							<p className="text-3xl font-bold text-rose-600">{directories.length}</p>
							<h5 className="text-sm text-muted-foreground">Centros</h5>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-rose-600">
								{new Set(directories.map(d => d.estado)).size}
							</p>
							<h5 className="text-sm text-muted-foreground">Estados</h5>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-rose-600">
								{new Set(directories.map(d => d.municipio)).size}
							</p>
							<h5 className="text-sm text-muted-foreground">Municipios</h5>
						</div>
					</div>
				</div>

			</section>

			{/* Selecionadores de estado */}
			<section className="flex justify-center gap-5 mt-6 flex-wrap p-2">
				<Select
					value={selectedState}
					onValueChange={handleSelectState}
					disabled={loadingLocation}
				>
					<SelectTrigger className="w-full max-w-48">
						<SelectValue placeholder={loadingLocation ? "Cargando..." : "Seleccione un Estado"} />
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

				<Select
					value={selectedMunicipality}
					onValueChange={handleSelectMunicipality}
					disabled={!selectedState || loadingLocation}
				>
					<SelectTrigger className="w-full max-w-50">
						<SelectValue placeholder={loadingLocation ? "Cargando..." : "Seleccione un municipio"} />
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
				{loading ? (
					<div className="text-center py-10">
						<p className="text-lg font-medium">Cargando directorios...</p>
					</div>
				) : error ? (
					<Card className="w-fit mx-auto mb-6">
						<CardContent className="p-6 text-center">
							<p className="text-foreground font-medium">{error}</p>
						</CardContent>
					</Card>
				) : selectedState ? (
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
					</div>
				)}
				<div className="flex flex-wrap justify-center mt-5 gap-2">
					{directories.map(d => d.estado).filter((v, i, a) => a.indexOf(v) === i).map(estado => (
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
			</section>
		</div>
	)
}

export default Directory