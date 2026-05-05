CREATE TABLE directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
    nombre varchar NOT NULL,
    telefono varchar NOT NULL,
    direccion varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

-- CREATE TABLE servicios (
--     id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
--     nombre varchar NOT NULL,
--     descripcion varchar NOT NULL,
--     created_at timestamp DEFAULT NOW()
-- );

-- CREATE TABLE tipos_violencia (
--     id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
--     nombre varchar NOT NULL,
--     descripcion varchar NOT NULL,
--     created_at timestamp DEFAULT NOW()
-- );


CREATE TABLE roles (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
    nombre varchar NOT NULL UNIQUE,
    descripcion varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

CREATE TABLE users (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
    cedula integer NOT NULL UNIQUE,
    nombre varchar NOT NULL,
    email varchar NOT NULL UNIQUE,
    username varchar NOT NULL UNIQUE,
    password varchar NOT NULL,
    rol integer NOT NULL REFERENCES roles(id),
    created_at timestamp DEFAULT NOW()
);