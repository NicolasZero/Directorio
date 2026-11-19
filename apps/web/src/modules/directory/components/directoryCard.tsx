import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Building2, ArrowRight } from "lucide-react"
import { Link } from 'react-router'
import type { DirectoryEntry } from '../schemes/directory'


function DirectoryCard({
	directorio,
	animationIndex = 0,
	returnQuery = '',
}: {
	directorio: DirectoryEntry
	animationIndex?: number
	returnQuery?: string
}) {
	return (
		<div
			className="directory-center-card group relative h-full"
			style={{ animationDelay: `${Math.min(animationIndex, 7) * 45}ms` }}
		>
			<Link
				to={`/directorio/${directorio.id}${returnQuery ? `?${returnQuery}` : ''}`}
				aria-label={`Ver detalles de ${directorio.nombre}`}
				onClick={() => {
					const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
					window.scrollTo({ top: 0, behavior })
				}}
				className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
			/>
			<Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-focus-within:ring-2 group-focus-within:ring-rose-600/50">
				<CardHeader className="pb-3">
					<div className="flex items-start gap-4">
						{directorio.foto ? (
							<img
								src={directorio.foto}
								alt={directorio.nombre}
								className="h-16 w-16 rounded-xl border-2 border-rose-100 object-cover"
							/>
						) : (
							<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900">
								<Building2 className="h-8 w-8 text-rose-600 dark:text-rose-100" />
							</div>
						)}
						<div className="min-w-0 flex-1">
							<CardTitle className="mb-2 text-lg leading-tight">
								{directorio.nombre}
							</CardTitle>
							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="outline" className="bg-rose-50 text-xs text-rose-700 dark:bg-rose-900 dark:text-rose-100">
									{directorio.estado}
								</Badge>
								<span className="text-xs text-muted-foreground">
									{directorio.municipio}
								</span>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="space-y-3">
						<div className="flex items-start gap-2 text-sm">
							<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
							<span className="text-muted-foreground">
								{directorio.direccion}
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-rose-500">
							<Phone className="h-4 w-4 shrink-0" />
							<a
								href={`tel:${directorio.telefono}`}
								className="relative z-20 font-medium focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
							>
								{directorio.telefono}
							</a>
						</div>
					</div>
					<div className="mt-4 flex items-center justify-between border-t pt-3 text-sm font-medium text-rose-600 transition-colors group-hover:text-rose-700">
						<span>Ver detalles</span>
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default DirectoryCard