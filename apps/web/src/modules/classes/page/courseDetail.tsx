import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, User, BarChart, BookOpen, Calendar } from "lucide-react"
import { Link } from "react-router"

// Curso por defecto (en el futuro vendrá de la base de datos)
const defaultCourse = {
	id: 1,
	title: "Introducción a la Programación",
	description: "Aprende los fundamentos de la programación con Python. Ideal para principiantes que desean iniciar en el mundo del desarrollo de software.",
	fullDescription: "Este curso está diseñado para personas que nunca han programado antes. A lo largo de 40 horas, aprenderás los conceptos fundamentales de la programación utilizando Python, uno de los lenguajes más populares y accesibles de la industria. Desde variables y tipos de datos hasta estructuras de control y funciones, este curso te proporcionará una base sólida para continuar tu viaje en el mundo del desarrollo de software.",
	instructor: "María García",
	instructorBio: "Ingeniera de software con más de 10 años de experiencia en la industria. Ha trabajado en empresas tecnológicas líderes y ha impartido cursos de programación en universidades reconocidas.",
	duration: "40 horas",
	level: "Principiante",
	image: "/default.png",
	startDate: "15 de Mayo, 2026",
	modules: [
		{ id: 1, title: "Introducción a la programación", duration: "4 horas" },
		{ id: 2, title: "Variables y tipos de datos", duration: "6 horas" },
		{ id: 3, title: "Operadores y expresiones", duration: "5 horas" },
		{ id: 4, title: "Estructuras condicionales", duration: "6 horas" },
		{ id: 5, title: "Bucles y iteraciones", duration: "7 horas" },
		{ id: 6, title: "Funciones y módulos", duration: "8 horas" },
		{ id: 7, title: "Proyecto final", duration: "4 horas" }
	],
	requirements: [
		"No se requiere experiencia previa en programación",
		"Computadora con acceso a internet",
		"Ganas de aprender y practicar"
	],
	whatYouWillLearn: [
		"Comprender los conceptos básicos de la programación",
		"Trabajar con variables, tipos de datos y operadores",
		"Implementar estructuras condicionales y bucles",
		"Crear funciones reutilizables",
		"Desarrollar programas básicos en Python",
		"Aplicar buenas prácticas de codificación"
	]
}

function CourseDetail() {
	return (
		<div className="container mx-auto py-8 px-4">
			{/* Botón volver */}
			<Button variant="ghost" asChild className="mb-6">
				<Link to="/clases" className="flex items-center gap-2">
					<ArrowLeft className="h-4 w-4" />
					Volver a Cursos
				</Link>
			</Button>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Columna principal */}
				<div className="lg:col-span-2 space-y-6">
					{/* Imagen */}
					<div className="aspect-video relative overflow-hidden rounded-lg">
						<img
							src={defaultCourse.image}
							alt={defaultCourse.title}
							className="object-cover w-full h-full"
						/>
					</div>

					{/* Título y metadata */}
					<div>
						<div className="flex flex-wrap gap-2 mb-3">
							<Badge variant="secondary">{defaultCourse.level}</Badge>
						</div>
						<h1 className="text-3xl font-bold mb-4">{defaultCourse.title}</h1>
						<p className="text-muted-foreground text-lg">
							{defaultCourse.fullDescription}
						</p>
					</div>

					{/* Lo que aprenderás */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Lo que aprenderás
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{defaultCourse.whatYouWillLearn.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										<span className="text-primary">✓</span>
										<span className="text-sm">{item}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Módulos del curso */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BarChart className="h-5 w-5" />
								Contenido del Curso
							</CardTitle>
							<CardDescription>
								{defaultCourse.modules.length} módulos • {defaultCourse.duration}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{defaultCourse.modules.map((module, index) => (
									<div
										key={module.id}
										className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
												{index + 1}
											</span>
											<span className="font-medium">{module.title}</span>
										</div>
										<span className="text-sm text-muted-foreground">{module.duration}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					<Card className="sticky top-8">
						<CardHeader>
							<CardTitle>Información del Curso</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Instructor */}
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
									<User className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">Instructor</p>
									<p className="text-sm text-muted-foreground">{defaultCourse.instructor}</p>
								</div>
							</div>

							{/* Duración */}
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
									<Clock className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">Duración</p>
									<p className="text-sm text-muted-foreground">{defaultCourse.duration}</p>
								</div>
							</div>

							{/* Nivel */}
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
									<BarChart className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">Nivel</p>
									<p className="text-sm text-muted-foreground">{defaultCourse.level}</p>
								</div>
							</div>

							{/* Fecha de inicio */}
							<div className="flex items-start gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
									<Calendar className="h-5 w-5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-medium">Fecha de inicio</p>
									<p className="text-sm text-muted-foreground">{defaultCourse.startDate}</p>
								</div>
							</div>

							<div className="pt-4 border-t">
								<Button className="w-full" size="lg">
									Inscríbete Ahora
								</Button>
								<p className="text-xs text-center text-muted-foreground mt-2">
									Acceso ilimitado • Certificado incluido
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Requisitos */}
					<Card>
						<CardHeader>
							<CardTitle>Requisitos</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{defaultCourse.requirements.map((req, index) => (
									<li key={index} className="flex items-start gap-2 text-sm">
										<span className="text-muted-foreground">•</span>
										<span>{req}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Instructor bio */}
					<Card>
						<CardHeader>
							<CardTitle>Sobre el Instructor</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								{defaultCourse.instructorBio}
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default CourseDetail