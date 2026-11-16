# Directorio INAMUJER

Aplicación web y API para el directorio, cursos y noticias de INAMUJER.

## Base de datos

Para crear las tablas, ejecuta `db/create_table.sql` en PostgreSQL. Si la base de
datos ya existe, vuelve a ejecutar el script para crear las tablas que falten;
las definiciones usan `IF NOT EXISTS`.

### Mapa y sedes georreferenciadas

Las parroquias se relacionan con municipios y estos con estados. Las sedes del
mapa se almacenan en `centros_atencion`, relacionadas con una parroquia y con
coordenadas decimales (`latitud`, `longitud`). Las calificaciones pueden ser
nulas si no fueron suministradas. La tabla `directorios` existente permanece
separada, ya que representa registros del directorio público y requiere datos
de contacto que no están disponibles para todas las sedes.

Para instalar el esquema y cargar las ubicaciones suministradas, ejecutar en
este orden desde la raíz del repositorio:

1. `db/create_table.sql`
2. `db/inster_data.sql` (catálogo existente de estados y municipios)
3. `db/parroquias.sql` (crea la tabla y carga las parroquias requeridas por las
   sedes entregadas)
4. `db/data_centros.sql` (carga las sedes y coordenadas)

Los dos scripts de carga son transaccionales e idempotentes. En la lista actual
se usan los nombres de estados y municipios existentes; Distrito Capital se
relaciona con `CARACAS`, y Girardot con `GIRARDOT (MARACAY)`. Las parroquias de
las sedes se cargan en esta primera migración; el catálogo nacional completo
debe incorporarse en una carga posterior tras normalizar y validar sus alias
contra los municipios ya existentes. Las sedes se clasifican como `INAMUJER`,
`MINISTERIO` u `OTRA`; las entidades estadales y municipales se mantienen como
`OTRA` para no atribuirles una dependencia institucional sin confirmación.

Documentación de la migración: Ing. Marco Quintana, 2026-11-14.

#### Mapa interactivo y límites GeoJSON

La página `/mapa` lee las sedes desde `GET /api/map/centers` y dibuja los
GeoJSON locales en `apps/web/src/modules/map/assets/`. Los límites de estados
usan coordenadas WGS84 (longitud, latitud) y las propiedades `mapName` (alias
para la interfaz) y `databaseName` (nombre del catálogo local). Colombia y
Brasil se representan como países vecinos no seleccionables. Al seleccionar un
estado, el mapa se acerca, filtra sus marcadores y abre el panel lateral con las
sedes. Al elegir una sede se muestra su detalle, fotografías (cuando existan),
ubicación y enlace a Google Maps. Restablecer o cerrar la selección devuelve el
mapa a la vista general y muestra todos los marcadores.

Los límites provienen de geoBoundaries, conjunto VEN-ADM1-42786344, basados en
OCHA Venezuela e Instituto Nacional de Estadística, año representado 2020.
Licencia del conjunto: CC BY 3.0 IGO. Atribución:
[geoBoundaries](https://www.geoboundaries.org/). El mapa incluye también el
polígono Natural Earth `West of Essequibo River`, con `status:
disputed_claim`, `claimedBy: Venezuela` y `administeredBy: Guyana`; se presenta
como zona reclamada, no como límite internacional acordado. Fuente del polígono:
[Natural Earth](https://www.naturalearthdata.com/), dominio público. Las
atribuciones se conservan en esta documentación.

Los contornos de Nicaragua, Costa Rica, Panamá, Colombia, Brasil, Guyana y
Surinam se derivan de Natural Earth 1:50m
(`venezuela-paises-vecinos.geojson`), dominio público; se muestran como
contexto regional, sin selección ni datos administrativos asociados. El
encuadre visible se recorta al occidente para centrar Venezuela y sus fronteras
cercanas; parte de Centroamérica queda fuera del recuadro. En escritorio, el
marco ocupa hasta 96rem de ancho por 36rem de alto; el terreno conserva su
proporción geográfica mientras el fondo marino se extiende hacia los lados.
Al seleccionar una región el mapa se desplaza para dejar espacio al panel, y
al cerrar o restablecer vuelve a quedar centrado. En pantallas pequeñas usa
una relación 4:3 y mantiene el panel debajo del mapa.

La fuente contiene Dependencias Federales, que aún no tiene un estado
relacionado en la base y por eso lleva `databaseName: null`. No contiene
el polígono de Guyana Esequiba como estado ADM1; este se integra aparte como
reclamación geográfica. La geometría superpuesta no añade municipios o sedes a
la base de datos de esa zona. El agua y el terreno se representan con colores
planos y gradientes, sin texturas lineales ni datos de elevación. Para mostrar
altimetría real se debe integrar una fuente DEM con licencia y atribución
compatibles.

#### Fotografías de las sedes

Las imágenes opcionales se sirven desde `apps/web/public/img_sede/`, de modo
que Vite las publique como archivos estáticos y no aumenten el paquete JavaScript.
Para cada centro se genera un nombre de carpeta estable a partir de
`nombre-estado-municipio`, normalizado a minúsculas y guiones. Colocar los
archivos con estos nombres:

```
apps/web/public/img_sede/<slug-del-centro>/img1.jpg
apps/web/public/img_sede/<slug-del-centro>/img2.jpg
```

Si una imagen no existe o no se puede cargar, el panel muestra un marcador de
imagen pendiente. No hay fotografías institucionales incluidas todavía.

## Noticias

Las noticias se consultan públicamente en `/api/news` y `/api/news/:id`. La
creación, edición y eliminación requieren una sesión con rol `Administrador` o
`Usuario`. El panel se encuentra en `/admin/noticias`.
