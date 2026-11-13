# Instrucciones de Copilot para Directorio INAMUJER

## Visión general del proyecto

Este repositorio es un monorepo de PNPM para una aplicación de directorio, cursos y noticias.

- `apps/api`: servidor API con Fastify para la lógica de negocio y acceso a PostgreSQL.
- `apps/web`: frontend con Vite + React + TypeScript para el sitio público y el área de administración.
- `db`: scripts SQL para la configuración del esquema de PostgreSQL.

La aplicación está principalmente en español y el backend/frontend siguen actualmente una estructura pragmática basada en módulos, en lugar de una convención estricta de framework.

## Arquitectura y convenciones

### Backend (`apps/api`)

- Usa módulos ES (`import` / `export`), no CommonJS.
- Mantén la inicialización del servidor en `src/main.js`.
- Los archivos de rutas viven en `src/routes/*.js` y son registrados automáticamente por el servidor principal usando el nombre de la carpeta como prefijo `/api/<ruta>`.
- La lógica de controladores debe vivir en `src/controllers/*.js` e importarse desde los archivos de rutas.
- El acceso a la base de datos está centralizado en `src/database/postgre.js`, que exporta una función `query` de PostgreSQL construida sobre `pg.Pool`.
- Prefiere los patrones existentes de manejo de errores: devuelve `reply.code(...).send(...)` con cargas útiles `{ error, status }` en las respuestas de la API.
- Usa variables de entorno cargadas con `process.loadEnvFile()` y guarda secretos de base de datos y autenticación en `.env` en lugar de hardcodearlos.
- Respeta el patrón actual de autenticación del proyecto: los tokens JWT se configuran mediante cookies, y los tokens de acceso y refresco se gestionan en `authController.js`.

### Frontend (`apps/web`)

- Usa Vite + React + TypeScript.
- Prefiere la estructura modular establecida bajo `src/modules/*` y carpetas por dominio como `auth`, `directory`, `classes`, `news`, `about` y `user`.
- Usa el alias existente `@/*` para resolver rutas del espacio de trabajo desde `src`.
- Mantén el estado de la UI, los esquemas de formularios, hooks y componentes de página alineados con la organización por funcionalidad.
- Reutiliza los primitvos inspirados en shadcn bajo `src/components/ui` al agregar controles o paneles de formularios.
- No introduzcas un framework diferente de manejo de estado salvo que la tarea lo requiera claramente.

### Base de datos

- PostgreSQL es la base de datos objetivo.
- Los scripts SQL en `db/` son la fuente de verdad para la creación del esquema.
- Mantén los patrones `IF NOT EXISTS` al actualizar definiciones del esquema.
- Si se requieren cambios relacionados con la base de datos, actualiza simultáneamente las definiciones SQL relevantes y la capa de consultas de la aplicación.
- El código API espera variables de entorno como `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT`.

## Flujo de desarrollo

Usa los scripts del espacio de trabajo desde la raíz del repositorio:

- `pnpm install`
- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm build`

Cuando trabajes dentro de un paquete, puedes usar los scripts locales de esa app si es necesario, pero mantén el flujo del monorepo desde la raíz como referencia principal.

## Expectativas de código

- Mantén los cambios enfocados y consistentes con los patrones ya usados en el repositorio.
- Prefiere ediciones pequeñas y explícitas sobre refactors amplios.
- Preserva las convenciones de nombres y la organización de carpetas existentes.
- Ajusta el estilo de mensajes y nombres al español del proyecto donde ya exista.
- Evita añadir dependencias innecesarias o cambios de framework sin necesidad.
- Cuando edites rutas API o frontend, mantén el comportamiento alineado con la estructura actual de enrutamiento y los límites entre público y administración.

## Validación

Antes de finalizar un cambio:

1. Ejecuta el comando de validación más pequeño y relevante.
2. Para trabajo frontend, prioriza una compilación o lint específico si está disponible.
3. Para trabajo API, confirma que el cambio sigue los patrones de Fastify + PostgreSQL y no rompe el registro de rutas.
4. Si el cambio afecta SQL o flujos de autenticación, verifica que el esquema y el comportamiento de tokens sigan siendo coherentes.

## Notas importantes específicas del repositorio

- La API pública se monta bajo `/api/*`.
- El servidor API raíz registra módulos de rutas automáticamente por nombre de carpeta.
- El frontend usa rutas anidadas y páginas cargadas con lazy loading; no rompas esas convenciones ni las rutas.
- El área de administración está protegida por un enrutador privado y flujos de autenticación; respeta el contexto de autenticación y el uso de tokens existentes.
- Mantén los flujos de usuario y administración alineados con los patrones actuales de acceso por roles.

## Al realizar cambios

- Prefiere actualizar archivos existentes dentro del mismo dominio (`routes`, `controllers`, `modules`, `hooks`, `schemes`) en lugar de introducir una estructura paralela.
- Si una funcionalidad atraviesa frontend y backend, actualiza ambos lados de forma consistente y conserva el contrato actual de solicitud/respuesta.
- En cambios de base de datos, asegura que los scripts SQL sigan siendo reejecutables e idempotentes.
- En cambios de autenticación o sesión, conserva el comportamiento basado en cookies y JWT sin romper los flujos de login y refresh.
