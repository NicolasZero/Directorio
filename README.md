# Directorio INAMUJER

Aplicación web para consultar directorios de centros de atención, explorar sedes georreferenciadas y administrar contenidos institucionales. El repositorio es un monorepo PNPM con una API Fastify, una aplicación web React y scripts de base de datos PostgreSQL.

## Requisitos

- Node.js 22.12 o posterior.
- pnpm 10.
- PostgreSQL.

## Instalación y ejecución local

1. Instala las dependencias desde la raíz del repositorio:

   ```bash
   pnpm install
   ```

2. Crea y configura una base de datos PostgreSQL. En una instalación nueva, ejecuta `db/create_table.sql`, `db/inster_data.sql` y `db/parroquias.sql`; después carga `db/insert_directorios.sql`, luego `db/data_centros.sql` y finalmente crea las vistas con `db/create_view.sql`. Son scripts SQL planos: ejecútalos desde el Query Tool de pgAdmin o con `psql`, no con `pg_restore`.

   `db/data_centros.sql` completa la dirección, descripción y coordenadas de los 133 registros de directorio suministrados sin reemplazar sus teléfonos ni correos. Agrupa los registros asociados a una misma sede para mostrar una sola ubicación en el mapa y elimina, dentro de la transacción, únicamente los 19 registros de prueba conocidos (`MAPA` / `CENTRO_ATENCION`, IDs de origen 1–19). El script se cancela si falta alguno de los 133 registros, si las ubicaciones no corresponden al estado indicado, si el conjunto de prueba está incompleto o si tiene datos relacionados. Realiza un respaldo antes de ejecutarlo.

   En una base que ya tiene los 133 registros de directorio y las 19 sedes de prueba, basta con ejecutar `db/data_centros.sql` una vez. Para conservar la ubicación enriquecida si luego vuelves a cargar `db/insert_directorios.sql`, su actualización idempotente respeta la descripción y dirección de los registros que ya tienen coordenadas. Las coordenadas indicadas como referencias de ciudad para ciertos municipios de Táchira, Trujillo y Zulia son aproximadas y deben confirmarse en terreno.

   Si ya tienes una base creada con las tablas `directorios` y `centros_atencion`, haz primero un respaldo PostgreSQL y luego ejecuta una sola vez `db/migrate_directorios_centros.sql`. La migración copia ambos conjuntos y sus servicios, responsables, redes y requisitos a `centros` y sus tablas relacionadas; valida los conteos y solo entonces elimina las tablas antiguas dentro de la misma transacción. Si encuentra datos existentes en las tablas destino o faltan tablas de origen, se cancela sin borrar las fuentes. Los scripts de carga actuales ya apuntan a la nueva tabla y pueden volver a ejecutarse sin duplicar registros, gracias a `fuente` y `fuente_id`.

   Los registros se conservan diferenciados en `tipo_registro` (`DIRECTORIO` o `MAPA`) y con su origen en `fuente`/`fuente_id`. No se fusionan automáticamente coincidencias entre ambos conjuntos: los esquemas no comparten una clave confiable para identificar una misma sede, y una unión aproximada podría borrar datos de contacto o ubicación. Los registros sospechosos de duplicidad deben compararse y consolidarse explícitamente antes de eliminar cualquiera.

3. Configura las variables de entorno de la API en `apps/api/.env`: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` para PostgreSQL; `JWT_SECRET`, `ACCESS_TOKEN_EXPIRATION`, `REFRESH_TOKEN_EXPIRATION`, `ACCESS_COOKIE_NAME` y `REFRESH_COOKIE_NAME` para autenticación. `PORT` y `CORS_URL` permiten configurar el puerto y el origen de la web. No guardes credenciales reales en el repositorio.

   La API escucha por defecto en el puerto `3001`; Vite publica la web en `http://localhost:3000` y redirige las solicitudes `/api` a la API.

4. Inicia los dos servicios desde la raíz:

   ```bash
   pnpm dev
   ```

   También puedes iniciarlos por separado:

   ```bash
   pnpm dev:web
   pnpm dev:api
   ```

   La ruta raíz de la API (`http://localhost:3001/`) devuelve un mensaje de estado; la interfaz web se abre en `http://localhost:3000`.

## Directorio público

La sección pública evita mostrar todos los registros en una sola vista y permite navegar por etapas:

1. **Exploración por estado:** cada tarjeta presenta el contorno SVG del estado desde `apps/web/src/modules/map/assets/venezuela-estados.geojson`, su nombre y el total de directorios. Las siluetas usan la paleta violeta del mapa y se realzan al pasar el cursor. La búsqueda local acepta nombres con o sin acentos. Las siluetas provienen del GeoJSON local; no se incorporó una dependencia de banderas estatales.
2. **Centros del estado:** al seleccionar una tarjeta, la URL conserva el estado mediante los parámetros `estado` y `nombre`. El estado queda visible como dato fijo y el selector de municipio ofrece únicamente municipios de ese estado.
3. **Listado de centros:** los resultados se cargan en páginas de nueve registros con carga progresiva. Cada tarjeta completa abre los detalles del centro; el enlace telefónico sigue permitiendo iniciar una llamada.
4. **Regreso desde el detalle:** al entrar al centro, se conservan los parámetros del estado en la URL. El botón «VOLVER» utiliza ese contexto para regresar a la lista de centros del estado seleccionado. Si el detalle se abrió directamente, vuelve al directorio general.

Las tarjetas de estado y centro aparecen con una transición escalonada. El selector anima la apertura, el cierre y la entrada de sus municipios; las animaciones de tarjetas y del selector respetan la preferencia del sistema para reducir movimiento. Al cambiar de estado o abrir un centro, la página se desplaza suavemente hacia arriba cuando el usuario no ha solicitado movimiento reducido.

## Mapa interactivo

El mapa es una sección independiente del directorio por estado. Muestra únicamente las regiones venezolanas dentro de un marco horizontal adaptable (proporción 14:11), ajustado al contorno para reducir el espacio vacío superior e inferior, sin dibujar ni etiquetar los países vecinos. Permite acercar y alejar el mapa, seleccionar una región para ver sus sedes y abrir el panel de detalles de una sede. Las sedes se identifican con iconos de casa, conservando el tamaño de los símbolos anteriores y los colores correspondientes: rosa para INAMUJER, violeta para el Ministerio y dorado para otras sedes. En teléfonos y tabletas, el panel se organiza debajo del mapa; en pantallas amplias puede mostrarse a su lado. La flecha del panel de detalle devuelve a las sedes de la región seleccionada sin cerrar esa región. Las transiciones del panel, las tarjetas y las fotografías están definidas en `apps/web/src/modules/map/assets/style.css`.

Los layouts públicos y administrativos permiten que el contenido crezca más allá de la altura de la pantalla. La navegación de escritorio usa el ancho disponible y en móvil conserva el menú desplegable, para evitar que la barra fuerce un desbordamiento horizontal.

## Botón de regreso compartido

Las pantallas que requieren navegación de regreso reutilizan `apps/web/src/components/backArrowButton.tsx`. El componente presenta una flecha con la paleta rojo-rosa del encabezado institucional, sombra y animaciones sutiles de interacción. Puede navegar a una ruta o ejecutar una acción local, y recibe una etiqueta accesible mediante `ariaLabel`.

## API del directorio

Las rutas públicas del directorio usan el prefijo `/api/directory`:

| Método y ruta | Uso |
| --- | --- |
| `GET /api/directory/state-counts` | Total de directorios por estado para construir las tarjetas. |
| `GET /api/directory/municipalities?estado=...` | Municipios del estado que tienen al menos un registro de directorio. |
| `GET /api/directory/count` | Totales generales de centros, estados y municipios. |
| `GET /api/directory?estado=...&municipio=...&page=...&limit=...` | Consulta paginada, filtrable por estado y municipio. |
| `GET /api/directory/:id` | Detalle de un centro, incluyendo servicios, responsables, redes y requisitos. |
| `GET /api/directory/all` | Consulta de todos los directorios, utilizada por vistas que requieren el conjunto completo. |

Las operaciones `POST`, `PUT` y `DELETE` sobre `/api/directory` requieren autenticación. Los endpoints se implementan en `apps/api/src/routes/directory.js` y `apps/api/src/controllers/directoryController.js`. Los formularios de alta y edición permiten guardar latitud y longitud opcionales; deben ingresarse ambas y estar dentro de los rangos geográficos válidos. El mapa incluye los centros de mapa existentes y agrupa los registros de directorio georreferenciados que comparten municipio, dirección y coordenadas, por lo que un nuevo registro con ubicación aparece automáticamente. Si el mapa ya está abierto, al volver a su pestaña se actualiza; también se puede solicitar la actualización manualmente.

## Compilación y lint

Compila el monorepo:

```bash
pnpm build
```

Para compilar únicamente la aplicación web:

```bash
pnpm --filter web build
```

Para ejecutar ESLint en la aplicación web:

```bash
pnpm --filter web lint
```
