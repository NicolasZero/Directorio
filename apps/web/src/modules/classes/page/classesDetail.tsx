import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, User, BarChart, BookOpen, Calendar, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react"
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
	// const { id } = useParams()
	// En producción, aquí harías una llamada a la API
	// const { data, loading } = useCourseDetail(id)
	const course = defaultCourse

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="py-4 md:py-10 px-4 overflow-hidden">
				<div className="container mx-auto">
					{/* Back button */}
					<Button
						variant="ghost"
						size="sm"
						className="mb-4 text-rose-600 hover:text-rose-700 hover:bg-rose-200"
						asChild
					>
						<Link to="/clases">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Volver a Cursos
						</Link>
					</Button>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Columna principal */}
						<div className="lg:col-span-2 space-y-6">
							{/* Badge y título */}
							<div>
								<Badge variant="outline" className="mb-4 bg-rose-200 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
									<GraduationCap className="w-3 h-3 mr-1" />
									{course.level}
								</Badge>
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
									{course.title}
								</h1>
								<p className="text-lg text-muted-foreground">
									{course.fullDescription}
								</p>
							</div>

							{/* Imagen */}
							<div className="aspect-video relative overflow-hidden dark:border-1 border-background-foreground rounded-xl shadow-lg">
								<img
									src={course.image}
									alt={course.title}
									className="object-cover w-full h-full"
								/>
							</div>

							{/* Lo que aprenderás */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BookOpen className="h-5 w-5 text-rose-600" />
										Lo que aprenderás
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{course.whatYouWillLearn.map((item, index) => (
											<li key={index} className="flex items-start gap-2">
												<CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
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
										<BarChart className="h-5 w-5 text-rose-600" />
										Contenido del Curso
									</CardTitle>
									<CardDescription>
										{course.modules.length} módulos • {course.duration}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{course.modules.map((module, index) => (
											<div
												key={module.id}
												className="flex items-center gap-2 flex-wrap p-4 rounded-lg border bg-muted/30 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950 dark:hover:border-gray-800 transition-colors cursor-default"
											>
												{/* <div className="flex items-center gap-3"> */}
												<span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-100 text-sm font-bold">
													{index + 1}
												</span>
												<span className="font-medium">{module.title}</span>
												{/* </div> */}
												<span className="text-sm text-muted-foreground flex items-center gap-1">
													<Clock className="w-3 h-3" />
													{module.duration}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							<Card className="sticky top-8 shadow-lg border-rose-200 dark:border-rose-800">
								<CardHeader>
									<CardTitle>Información del Curso</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Instructor */}
									<div className="flex items-start gap-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
											<User className="h-5 w-5 text-rose-600 dark:text-rose-100" />
										</div>
										<div>
											<p className="text-sm font-medium">Instructor</p>
											<p className="text-sm text-muted-foreground">{course.instructor}</p>
										</div>
									</div>

									{/* Duración */}
									<div className="flex items-start gap-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
											<Clock className="h-5 w-5 text-rose-600 dark:text-rose-100" />
										</div>
										<div>
											<p className="text-sm font-medium">Duración</p>
											<p className="text-sm text-muted-foreground">{course.duration}</p>
										</div>
									</div>

									{/* Nivel */}
									<div className="flex items-start gap-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
											<BarChart className="h-5 w-5 text-rose-600 dark:text-rose-100" />
										</div>
										<div>
											<p className="text-sm font-medium">Nivel</p>
											<p className="text-sm text-muted-foreground">{course.level}</p>
										</div>
									</div>

									{/* Fecha de inicio */}
									<div className="flex items-start gap-3">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
											<Calendar className="h-5 w-5 text-rose-600 dark:text-rose-100" />
										</div>
										<div>
											<p className="text-sm font-medium">Fecha de inicio</p>
											<p className="text-sm text-muted-foreground">{course.startDate}</p>
										</div>
									</div>

									<div className="pt-4 border-t">
										<Button className="w-full font-bold bg-rose-600 hover:bg-rose-700" size="lg">
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
									<CardTitle className="flex items-center gap-2">
										<AlertCircle className="h-5 w-5 text-rose-600" />
										Requisitos
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ul className="space-y-3">
										{course.requirements.map((req, index) => (
											<li key={index} className="flex items-start gap-2 text-sm">
												<span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-100 text-xs font-bold shrink-0 mt-0.5">
													{index + 1}
												</span>
												<span className="text-muted-foreground">{req}</span>
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
										{course.instructorBio}
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default CourseDetail