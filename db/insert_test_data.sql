INSERT INTO directorios (nombre, descripcion, direccion, telefono, correo, foto, estado_id, municipio_id, horario) VALUES
/*1*/('Centro de Atención Inamujer Caracas', 'El Centro de Atención Inamujer Caracas es una institución dedicada a promover el empoderamiento y bienestar de las mujeres en la región capital. Brindamos servicios de orientación, asesoría legal, apoyo psicológico y programas de capacitación profesional.', 'Av. Universidad, Edificio Centro, Piso 1, Caracas', '(0212) 555-1234', 'caracas@inamujer.gob.ve', NULL, 1, 1, 'Lunes a Viernes: 8:00 AM - 5:00 PM'),
/*2*/('Oficina Atención Mujer Libertador', 'Oficina de atención regional para mujeres en Libertador, Caracas. Ofrecemos atención personalizada y orientación en casos de violencia y trámites institucionales.', 'Plaza Bolívar, Caracas', '(0212) 555-5678', 'libertador@inamujer.gob.ve', NULL, 1, 1, 'Lunes a Viernes: 8:00 AM - 4:00 PM'),
/*3*/('Centro Inamujer Chacao', 'Centro especializado en apoyo psicológico y asesoría legal para mujeres en el municipio Chacao, Miranda.', 'Av. principal de Chacao, Caracas', '(0212) 555-9012', 'chacao@inamujer.gob.ve', './uh_eto_bleh.png', 13, 183, 'Lunes a Viernes: 8:00 AM - 5:00 PM'),
/*4*/('Atención a la Mujer Cristobal Rojas', 'Centro de atención en Charallave dedicado a la prevención y respuesta frente a casos de violencia de género.', 'Calle principal, Charallave', '(0212) 555-3456', 'cristobalrojas@inamujer.gob.ve', NULL, 13, 177, 'Lunes a Viernes: 8:00 AM - 4:00 PM'),
/*5*/('Centro de la Mujer Miranda', 'Centro de referencia estatal para atención integral de las mujeres, con programas de formación, asesoría y apoyo social.', 'Av. principal de Los Tilos, Miranda', '(0212) 555-7890', 'miranda@inamujer.gob.ve', NULL, 13, 183, 'Lunes a Viernes: 8:00 AM - 5:00 PM'),
/*6*/('Instituto Nacional de la Mujer Aragua', 'Instituto Nacional de la Mujer Aragua brinda servicios de orientación, capacitación y apoyo legal a mujeres en Maracay.', 'Av. Bolívar, Maracay, Estado Aragua', '(0243) 555-1111', 'aragua@inamujer.gob.ve', NULL, 4, 30, 'Lunes a Viernes: 8:00 AM - 5:00 PM'),
/*7*/('Centro de Atención Aragua', 'Centro regional de atención en Aragua con servicios especializados para mujeres y familias.', 'Centro de Maracay, Aragua', '(0243) 555-2222', 'atencionaragua@inamujer.gob.ve', NULL, 4, 30, 'Lunes a Viernes: 8:00 AM - 4:00 PM'),
/*8*/('Inamujer Zulia', 'Oficina principal de Inamujer en Zulia para atención, asesoría y acompañamiento a mujeres en situación de vulnerabilidad.', 'Av. 5 de Julio, Maracaibo', '(0261) 555-3333', 'zulia@inamujer.gob.ve', NULL, 21, 307, 'Lunes a Viernes: 8:00 AM - 5:00 PM'),
/*9*/('Centro de la Mujer Zuliana', 'Centro de atención integral en Maracaibo con enfoque en prevención, asesoría legal y apoyo psicológico.', 'Calle 72, Maracaibo', '(0261) 555-4444', 'zuliana@inamujer.gob.ve', NULL, 21, 307, 'Lunes a Viernes: 8:00 AM - 4:00 PM'),
/*10*/('Inamujer Lara', 'Centro de atención en Barquisimeto con servicios de orientación, asistencia legal y formación para mujeres.', 'Av. Lara, Barquisimeto', '(0251) 555-5555', 'lara@inamujer.gob.ve', NULL, 11, 135, 'Lunes a Viernes: 8:00 AM - 5:00 PM');

INSERT INTO servicios_directorio (directorio_id, servicio) VALUES
(1, 'Asesoría legal gratuita'),
(1, 'Apoyo psicológico'),
(1, 'Programas de capacitación'),
(1, 'Orientación laboral'),
(1, 'Atención a víctimas de violencia'),
(1, 'Trámites de documentación'),
(2, 'Orientación y asesoría legal'),
(2, 'Acompañamiento psicológico'),
(3, 'Orientación en violencia de género'),
(4, 'Apoyo en casos de violencia'),
(5, 'Programación de talleres y cursos'),
(6, 'Asesoría legal y administrativa'),
(7, 'Atención psicológica'),
(8, 'Atención social y familiar'),
(9, 'Apoyo jurídico'),
(10, 'Capacitación y formación profesional');

INSERT INTO responsables_directorio (directorio_id, nombre, cargo) VALUES
(1, 'Dra. María González', 'Directora del Centro'),
(1, 'Lic. Ana Pérez', 'Coordinadora de Programas'),
(1, 'Abg. Carlos Rodríguez', 'Asesor Legal'),
(2, 'Lic. Sandra Méndez', 'Coordinadora Regional'),
(3, 'Dra. Juliana Torres', 'Directora de Servicio'),
(4, 'Lic. Rosa Morales', 'Gerente de Atención'),
(5, 'Abg. Laura Suárez', 'Responsable de Programas'),
(6, 'Lic. Karina López', 'Coordinadora General'),
(7, 'Dra. Isabel Rojas', 'Asesora Psicológica'),
(8, 'Lic. María Castillo', 'Directora Regional'),
(9, 'Abg. Patricia Fernández', 'Asesora Legal'),
(10, 'Lic. Gabriela Fernández', 'Coordinadora de Proyectos');

INSERT INTO redes_directorio (directorio_id, nombre, url, icono) VALUES
(1, 'Instagram', 'https://instagram.com/inamujer_caracas', 'instagram'),
(1, 'Facebook', 'https://facebook.com/inamujer_caracas', 'facebook'),
(1, 'Twitter', 'https://twitter.com/inamujer_caracas', 'twitter'),
(2, 'Instagram', 'https://instagram.com/inamujer_libertador', 'instagram'),
(3, 'Facebook', 'https://facebook.com/inamujer_chacao', 'facebook'),
(5, 'Instagram', 'https://instagram.com/inamujer_miranda', 'instagram'),
(8, 'Twitter', 'https://twitter.com/inamujer_zulia', 'twitter'),
(10, 'Facebook', 'https://facebook.com/inamujer_lara', 'facebook');