-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA auth;

CREATE TABLE auth.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar NOT NULL UNIQUE,
    descripcion varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cedula integer NOT NULL UNIQUE,
    nombre varchar NOT NULL,
    email varchar NOT NULL UNIQUE,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    rol UUID NOT NULL REFERENCES roles(id),
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE estados (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL UNIQUE
);

CREATE TABLE municipios (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL,
    estado_id integer NOT NULL REFERENCES estados(id)
    UNIQUE (nombre, estado_id)
);

CREATE TABLE directorios (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL,
    descripcion text,
    direccion varchar NOT NULL,
    telefono varchar NOT NULL,
    correo varchar,
    foto varchar,
    municipio_id integer NOT NULL REFERENCES municipios(id),
    horario varchar,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE servicios_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    servicio varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE responsables_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    nombre varchar NOT NULL,
    cargo varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE redes_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    nombre varchar NOT NULL,
    url varchar NOT NULL,
    icono varchar,
    created_at timestamp DEFAULT NOW()
);