import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building2, Search, X } from 'lucide-react'

interface StateDirectoryCount {
	estado: string
	total_directorios: number
}

type Position = [number, number]

interface StateFeature {
	properties: {
		name: string
		databaseName: string | null
	}
	geometry: {
		type: 'Polygon' | 'MultiPolygon'
		coordinates: Position[][] | Position[][][]
	}
}

interface StateFeatureCollection {
	features: StateFeature[]
}

function normalizeStateName(value: string) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase()
}

function getGradientId(value: string) {
	return `state-map-gradient-${normalizeStateName(value).replace(/[^A-Z0-9]+/g, '-')}`
}

function getStatePath(feature: StateFeature) {
	const polygons = feature.geometry.type === 'Polygon'
		? [feature.geometry.coordinates as Position[][]]
		: feature.geometry.coordinates as Position[][][]
	const points = polygons.flat(2)
	const latitudes = points.map(([, latitude]) => latitude)
	const minLatitude = Math.min(...latitudes)
	const maxLatitude = Math.max(...latitudes)
	const longitudeScale = Math.cos(((minLatitude + maxLatitude) / 2) * Math.PI / 180)
	const projected = points.map(([longitude, latitude]) => [longitude * longitudeScale, latitude] as Position)
	const projectedLongitudes = projected.map(([longitude]) => longitude)
	const projectedLatitudes = projected.map(([, latitude]) => latitude)
	const minX = Math.min(...projectedLongitudes)
	const maxX = Math.max(...projectedLongitudes)
	const minY = Math.min(...projectedLatitudes)
	const maxY = Math.max(...projectedLatitudes)
	const scale = Math.min(88 / (maxX - minX || 1), 88 / (maxY - minY || 1))
	const offsetX = (100 - (maxX - minX) * scale) / 2
	const offsetY = (100 - (maxY - minY) * scale) / 2

	return polygons.map((polygon) => polygon.map((ring) => {
		const commands = ring.map(([longitude, latitude], index) => {
			const x = offsetX + (longitude * longitudeScale - minX) * scale
			const y = offsetY + (maxY - latitude) * scale
			return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
		})
		return `${commands.join(' ')} Z`
	}).join(' ')).join(' ')
}

function StateDirectoryGrid() {
	const [states, setStates] = useState<StateDirectoryCount[]>([])
	const [features, setFeatures] = useState<StateFeature[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		let cancelled = false

		const loadStates = async () => {
			setLoading(true)
			setError(null)

			try {
				const [countsResponse, geometryResponse] = await Promise.all([
					fetch('/api/directory/state-counts'),
					fetch(new URL('../../map/assets/venezuela-estados.geojson', import.meta.url)),
				])

				if (!countsResponse.ok || !geometryResponse.ok) {
					throw new Error('No se pudo cargar la información de los estados.')
				}

				const countsData = await countsResponse.json() as { data?: StateDirectoryCount[] }
				const geometryData = await geometryResponse.json() as StateFeatureCollection

				if (!Array.isArray(countsData.data) || !Array.isArray(geometryData.features)) {
					throw new Error('La respuesta de estados tiene un formato inválido.')
				}

				if (!cancelled) {
					setStates(countsData.data)
					setFeatures(geometryData.features)
				}
			} catch (loadError) {
				console.error(loadError)
				if (!cancelled) setError('No se pudieron cargar los estados. Intenta de nuevo más tarde.')
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		loadStates()
		return () => {
			cancelled = true
		}
	}, [])

	const featuresByDatabaseName = new Map<string, StateFeature>()
	features.forEach((feature) => {
		const databaseName = feature.properties.databaseName
		if (databaseName) featuresByDatabaseName.set(normalizeStateName(databaseName), feature)
	})

	const normalizedQuery = normalizeStateName(searchQuery)
	const filteredStates = states.filter((state) => {
		const feature = featuresByDatabaseName.get(normalizeStateName(state.estado))
		const displayName = feature?.properties.name ?? state.estado
		return normalizeStateName(state.estado).includes(normalizedQuery) ||
			normalizeStateName(displayName).includes(normalizedQuery)
	})

	return (
		<section className="container mx-auto px-4 py-10 md:px-8">
			<div className="mb-8 text-center">
				<p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
					Cobertura nacional
				</p>
				<h2 className="text-2xl font-bold md:text-3xl">Explora los directorios por estado</h2>
				<p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
					Selecciona un estado para consultar sus centros de atención.
				</p>
			</div>

			{loading ? (
				<p className="py-10 text-center text-muted-foreground">Cargando estados...</p>
			) : error ? (
				<Card className="mx-auto max-w-lg">
					<CardContent className="p-6 text-center text-muted-foreground">{error}</CardContent>
				</Card>
			) : (
				<>
					<div className="mx-auto mb-8 max-w-xl">
						<label htmlFor="state-directory-search" className="mb-2 block text-left text-sm font-medium">
							Buscar un estado
						</label>
						<div className="relative">
							<Search
								className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8969b3]"
								aria-hidden="true"
							/>
							<Input
								id="state-directory-search"
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Escribe el nombre de un estado..."
								autoComplete="off"
								className="h-12 rounded-xl border-[#c2addc]/60 bg-background pl-12 pr-12 shadow-sm transition-shadow focus-visible:border-[#8969b3] focus-visible:ring-[#8969b3]/30"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery('')}
									className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-[#f5f0fa] hover:text-[#694395] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8969b3] dark:hover:bg-[#302341]"
									aria-label="Limpiar búsqueda de estado"
								>
									<X className="h-4 w-4" aria-hidden="true" />
								</button>
							)}
						</div>
						<p className="mt-2 text-left text-xs text-muted-foreground" aria-live="polite">
							{searchQuery
								? `${filteredStates.length} ${filteredStates.length === 1 ? 'estado encontrado' : 'estados encontrados'}`
								: 'Puedes buscar con o sin acentos.'}
						</p>
					</div>

					{filteredStates.length > 0 ? (
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{filteredStates.map((state, index) => {
								const feature = featuresByDatabaseName.get(normalizeStateName(state.estado))
								const gradientId = getGradientId(state.estado)
								const stateDisplayName = feature?.properties.name ?? state.estado

								return (
									<Link
										key={state.estado}
										to={`/directorio?estado=${encodeURIComponent(state.estado)}&nombre=${encodeURIComponent(stateDisplayName)}`}
										aria-label={`Ver ${state.total_directorios} ${state.total_directorios === 1 ? 'directorio' : 'directorios'} en ${stateDisplayName}`}
										className="state-directory-card-entry group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
										style={{ animationDelay: `${Math.min(index, 7) * 45}ms` }}
									>
										<Card className="h-full overflow-hidden border border-violet-100/80 bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-violet-200 group-hover:shadow-xl dark:border-violet-950">
											<CardContent className="flex h-full flex-col items-center p-5 text-center">
												<div className="flex h-36 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#f5f0fa] via-[#fdfbff] to-[#eee5f7] p-3 dark:from-[#241d32] dark:via-[#1c1730] dark:to-[#302341]">
													{feature ? (
														<svg
															viewBox="0 0 100 100"
															className="h-full w-full overflow-visible transition-transform duration-300 group-hover:scale-105"
															role="img"
															aria-label={`Silueta de ${feature.properties.name}`}
														>
															<defs>
																<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
																	<stop offset="0%" stopColor="#8056b2" />
																	<stop offset="48%" stopColor="#694395" />
																	<stop offset="100%" stopColor="#4f3478" />
																</linearGradient>
															</defs>
															<path
																d={getStatePath(feature)}
																fill={`url(#${gradientId})`}
																fillRule="evenodd"
																className="drop-shadow-sm transition-[fill,stroke,filter,stroke-width] duration-200 group-hover:fill-[#8969b3] group-hover:stroke-[#e5d7f4] group-hover:stroke-[1.8] group-hover:[filter:drop-shadow(0_0_3px_rgb(197_164_232_/_35%))]"
																stroke="#c2addc"
																strokeOpacity="0.58"
																strokeWidth="1"
																strokeLinejoin="round"
																vectorEffect="non-scaling-stroke"
															/>
														</svg>
													) : (
														<Building2 className="h-12 w-12 text-[#8969b3]" aria-hidden="true" />
													)}
												</div>
												<h3 className="mt-4 text-lg font-semibold group-hover:text-[#694395] dark:group-hover:text-[#c2addc]">
													{feature?.properties.name ?? state.estado}
												</h3>
												<p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
													<Building2 className="h-4 w-4 text-[#8969b3]" aria-hidden="true" />
													<span>
														{state.total_directorios} {state.total_directorios === 1 ? 'centro' : 'centros'}
													</span>
												</p>
											</CardContent>
										</Card>
									</Link>
								)
							})}
						</div>
					) : (
						<Card className="mx-auto max-w-lg border-[#c2addc]/40">
							<CardContent className="p-8 text-center">
								<Search className="mx-auto mb-3 h-8 w-8 text-[#8969b3]" aria-hidden="true" />
								<h3 className="text-lg font-semibold">No encontramos ese estado</h3>
								<p className="mt-1 text-sm text-muted-foreground">
									Prueba con otro nombre o limpia la búsqueda para ver todos los estados.
								</p>
							</CardContent>
						</Card>
					)}
				</>
			)}
		</section>
	)
}

export default StateDirectoryGrid
