import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DirectoryCard from '@/modules/directory/components/directoryCard';
import Map from '@/modules/map/components/map';

// Importamos el CSS que acabamos de crear
import '@/modules/map/assets/style.css';

// Tipo para los datos del directorio
interface DirectoryEntry {
	id: number;
	nombre: string;
	direccion: string;
	telefono: string;
	foto?: string;
	municipio: string;
	estado: string;
}

const MapaInteractivo = () => {
	const [selectedState, setSelectedState] = useState<string>('');

	const handleClick = (e: any) => {
		const nombre = e.target.getAttribute('data-name');
		if (nombre) setSelectedState(nombre);
	};

	const [directoriosData, setDirectoriosData] = useState<DirectoryEntry[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchDirectorios = async () => {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch('/api/directory')
				const data = await response.json()

				if (!response.ok) {
					throw new Error(data?.error || 'Error al cargar directorios')
				}

				setDirectoriosData(data?.data || [])
			} catch (fetchError) {
				console.error(fetchError)
				setError('No se pudieron cargar los directorios. Intenta de nuevo más tarde.')
				setDirectoriosData([])
			} finally {
				setLoading(false)
			}
		}

		fetchDirectorios()
	}, [])

	// Filtrar directorios según selección
	const filteredDirectorios = directoriosData.filter((item) => {
		const matchesState = selectedState ? item.estado.toLowerCase() === selectedState.toLowerCase() : true;
		return matchesState;
	});

	return (
		<div className="min-h-screen">
			<section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-4 md:py-10 px-4 overflow-hidden">
				<div className="container mx-auto text-center max-w-2xl">
					<Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
						<MapPin className="w-3 h-3 mr-1" />
						Mapa Interactivo
					</Badge>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
						Explora los <span className="text-rose-600">Centros de Atención</span>
					</h1>

					{/* Stats */}
					<div className="text-center">
						<span className="text-3xl font-bold text-rose-600">{loading ? '...' : directoriosData.length}</span>
						<p className="text-sm text-muted-foreground">Centros</p>
					</div>
				</div>
			</section>
			{error && (
				<section className="px-4">
					<Card className="max-w-3xl mx-auto mb-6 border border-rose-200 bg-rose-50 text-rose-700">
						<CardContent className="text-center">
							{error}
						</CardContent>
					</Card>
				</section>
			)}
			{/* Selecionadores de estado */}
			<section>
				<div className="my-6 text-center">
					<h3 className="text-xl font-semibold mb-2">
						Selecciona un Estado
					</h3>
					<p className="text-muted-foreground mb-4">
						Haz clic en un estado del mapa para ver los centros de atención disponibles
					</p>
				</div>

				{/* Mapa de Venezuela */}
				<div className="map-container w-full md:w-[85%] h-[50vh] md:h-[90vh] max-w-[800px] relative mx-auto my-5 flex justify-center overflow-auto border rounded-xl shadow-lg">

					{/* 1. El Wrapper maneja la lógica del zoom */}
					<TransformWrapper
						initialScale={0.5}
						minScale={0.5}
						maxScale={3}
					>
						{(
							{ zoomIn, zoomOut, resetTransform }
						) => (
							<>
								{/* Controles flotantes opcionales */}
								<div className="flex items-center gap-2 absolute bottom-10 left-10 z-50">
									<Button className='text-rose-300 dark:text-rose-800' onClick={() => zoomIn()}>+</Button>
									<Button className='text-rose-300 dark:text-rose-800' onClick={() => zoomOut()}>-</Button>
									<Button className='text-rose-300 dark:text-rose-800' onClick={() => resetTransform()}>Reset</Button>
								</div>

								{/* 2. El Component es el área visual donde ocurre el zoom */}
								<TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
									<Map handleClick={handleClick} />
								</TransformComponent>
							</>
						)}
					</TransformWrapper>
				</div>
			</section>

			<section className="py-8 px-4">
				{selectedState && (
					<div>
						<div className="mb-8">
							<h2 className="text-2xl font-bold">
								Directorios en {selectedState}
							</h2>
							<p className="text-muted-foreground mt-1">
								{filteredDirectorios.length} resultado
								{filteredDirectorios.length !== 1 ? 's' : ''} encontrado
								{filteredDirectorios.length !== 1 ? 's' : ''}
							</p>
						</div>

						{filteredDirectorios.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredDirectorios.map((directorio) => (
									<DirectoryCard key={directorio.id} directorio={directorio} />
								))}
							</div>
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
										Intenta seleccionar un estado diferente
									</p>
									<Button
										variant="outline"
										onClick={() => setSelectedState('')}
									>
										Ver todos los estados
									</Button>
								</CardContent>
							</Card>
						)}
					</div>
				)}
			</section>
		</div>
	);
};

export default MapaInteractivo;