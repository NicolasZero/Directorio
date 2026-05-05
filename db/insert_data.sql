-- INSERT INTO directorio (nombre, telefono, direccion) VALUES 
-- ('Centro de Atención a Víctimas de Violencia Intrafamiliar (CEAVI)', '800 81 234', 'Enrique del Piano 480'),
-- ('Casa de Acogida (Comedor de la Mujer)', '(55) 57837902', 'Pino 539'),
-- ('Comisaría de la Mujer y la Familia (CMF) 1', '(55) 56144927', 'Av. México 158, La Perla'),
-- ('Comisaría de la Mujer y la Familia (CMF) 2', '(55) 57804984', 'Cuauhtémoc 38, Santa Martha'),
-- ('Comisaría de la Mujer y la Familia (CMF) 3', '(55) 57351108', 'Av. Principal S/N, Ixtapaluca'),
-- ('Comisaría de la Mujer y la Familia (CMF) 4', '(55) 59851640', 'San Isidro, Ixtapaluca');


-- INSERT INTO servicios (nombre, descripcion) VALUES 
-- ('Atención Psicológica', 'Proporcionamos apoyo emocional y psicológico a personas que han sufrido violencia'),
-- ('Asesoría Jurídica', 'Brindamos asesoría legal especializada en casos de violencia intrafamiliar'),
-- ('Trabajo Social', 'Realizamos trabajo social para apoyar a las víctimas en su proceso de recuperación'),
-- ('Grupos de Autoayuda', 'Organizamos grupos de autoayuda para mujeres que han sufrido violencia'),
-- ('Talleres', 'Impartimos talleres para el desarrollo personal y profesional de las mujeres'),
-- ('Pláticas', 'Realizamos pláticas para sensibilizar a la comunidad sobre la violencia intrafamiliar');


-- INSERT INTO tipos_violencia (nombre, descripcion) VALUES 
-- ('Violencia Psicológica', 'Proporcionamos apoyo emocional y psicológico a personas que han sufrido violencia'),
-- ('Violencia Física', 'Brindamos asesoría legal especializada en casos de violencia intrafamiliar'),
-- ('Violencia Sexual', 'Realizamos trabajo social para apoyar a las víctimas en su proceso de recuperación'),
-- ('Violencia Económica', 'Organizamos grupos de autoayuda para mujeres que han sufrido violencia'),
-- ('Violencia Patrimonial', 'Impartimos talleres para el desarrollo personal y profesional de las mujeres'),
-- ('Violencia Obstétrica', 'Realizamos pláticas para sensibilizar a la comunidad sobre la violencia intrafamiliar');

INSERT INTO roles (nombre, descripcion) VALUES 
('Administrador', 'Administrador del sistema'),
('Usuario', 'Usuario del sistema');

INSERT INTO users (cedula, nombre, username, email, password, rol) VALUES 
('12345678', 'Administrador', 'admin', 'admin@admin.com', '$2b$10$GUT8F20qqtJZkJo4m/ugpeMAvlQPwDJD.tipGSDPjXSNzB2p8FgSK', 1);
