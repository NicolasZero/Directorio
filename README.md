# Directorio INAMUJER

Aplicación web y API para el directorio, cursos y noticias de INAMUJER.

## Base de datos

Para crear las tablas, ejecuta `db/create_table.sql` en PostgreSQL. Si la base de
datos ya existe, vuelve a ejecutar el script para crear las tablas que falten;
las definiciones usan `IF NOT EXISTS`.

## Noticias

Las noticias se consultan públicamente en `/api/news` y `/api/news/:id`. La
creación, edición y eliminación requieren una sesión con rol `Administrador` o
`Usuario`. El panel se encuentra en `/admin/noticias`.
