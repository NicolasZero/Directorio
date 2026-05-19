-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA if NOT EXISTS auth;

CREATE TABLE if NOT EXISTS auth.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar NOT NULL UNIQUE,
    descripcion varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cedula integer NOT NULL UNIQUE,
    nombre varchar NOT NULL,
    email varchar NOT NULL UNIQUE,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    rol UUID NOT NULL REFERENCES auth.roles(id),
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS estados (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL UNIQUE
);

CREATE TABLE if NOT EXISTS municipios (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL,
    estado_id integer NOT NULL REFERENCES estados(id)
);

CREATE TABLE if NOT EXISTS directorios (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    nombre varchar NOT NULL,
    descripcion text,
    direccion varchar NOT NULL,
    telefono varchar NOT NULL,
    correo varchar,
    foto varchar,
    estado_id integer NOT NULL REFERENCES estados(id),
    municipio_id integer NOT NULL REFERENCES municipios(id),
    horario varchar,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS servicios_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    servicio varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS responsables_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    nombre varchar NOT NULL,
    cargo varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS redes_directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    directorio_id integer NOT NULL REFERENCES directorios(id) ON DELETE CASCADE,
    nombre varchar NOT NULL,
    url varchar NOT NULL,
    icono varchar,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS courses (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    title varchar NOT NULL,
    description text NOT NULL,
    full_description text,
    instructor varchar NOT NULL,
    instructor_bio text,
    duration varchar,
    level varchar,
    image varchar,
    start_date date,
    created_at timestamp DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE if NOT EXISTS course_modules (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title varchar NOT NULL,
    duration varchar NOT NULL,
    orden integer NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS course_requirements (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    requirement text NOT NULL,
    orden integer NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE if NOT EXISTS course_outcomes (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1),
    course_id integer NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    outcome text NOT NULL,
    orden integer NOT NULL,
    created_at timestamp DEFAULT NOW()
);