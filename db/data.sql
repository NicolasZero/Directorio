CREATE TABLE directorio (
    id integer NOT NULL UNIQUE GENERATED ALWAYS AS IDENTITY (START WITH 1) primary key,
    nombre varchar NOT NULL,
    telefono varchar NOT NULL,
    direccion varchar NOT NULL,
    created_at timestamp DEFAULT NOW()
);

INSERT INTO directorio (nombre, telefono, direccion) VALUES 
('Centro de Atención a Víctimas de Violencia Intrafamiliar (CEAVI)', '800 81 234', 'Enrique del Piano 480'),
('Casa de Acogida (Comedor de la Mujer)', '(55) 57837902', 'Pino 539'),
('Comisaría de la Mujer y la Familia (CMF) 1', '(55) 56144927', 'Av. México 158, La Perla'),
('Comisaría de la Mujer y la Familia (CMF) 2', '(55) 57804984', 'Cuauhtémoc 38, Santa Martha'),
('Comisaría de la Mujer y la Familia (CMF) 3', '(55) 57351108', 'Av. Principal S/N, Ixtapaluca'),
('Comisaría de la Mujer y la Familia (CMF) 4', '(55) 59851640', 'San Isidro, Ixtapaluca');