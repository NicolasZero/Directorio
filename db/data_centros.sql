-- Enriquece los 133 registros del directorio con ubicaciones de sus sedes
-- fisicas y elimina los 19 centros de prueba cargados originalmente para el mapa.
-- Requiere create_table.sql, inster_data.sql, parroquias.sql e insert_directorios.sql.
-- Las coordenadas indicadas como referencias de ciudad se cargan como aproximadas;
-- confirmar las ubicaciones exactas antes de usarlas para navegacion presencial.
-- Hacer un respaldo de la base de datos antes de ejecutar.

BEGIN;

CREATE TEMP TABLE centros_suministrados (
    fuente_ids integer[] NOT NULL,
    estado_id integer NOT NULL,
    municipio_id integer NOT NULL,
    organismo varchar NOT NULL,
    descripcion text NOT NULL,
    direccion varchar NOT NULL,
    latitud numeric(9, 6) NOT NULL,
    longitud numeric(9, 6) NOT NULL,
    tipo_organismo varchar NOT NULL
) ON COMMIT DROP;

INSERT INTO centros_suministrados VALUES
    (ARRAY[1], 22, 324, 'CAFIM Puerto Ayacucho', 'Centro multidisciplinario de atencion juridica, contencion psicologica, orientacion social y prevencion de la violencia de genero.', 'Av. Orinoco, Sede CAFIM Puerto Ayacucho, Municipio Atures, Puerto Ayacucho 7101, Estado Amazonas.', 5.663100, -67.623400, 'OTRA'),
    (ARRAY[2], 22, 327, 'Alcaldia de San Carlos de Rio Negro', 'Oficina municipal de enlace para la recepcion de casos, canalizacion de denuncias y apoyo institucional en la zona fronteriza.', 'Sede de la Alcaldia del Municipio Rio Negro, Calle Principal, San Carlos de Rio Negro, Estado Amazonas.', 1.916700, -67.050000, 'OTRA'),
    (ARRAY[3], 22, 329, 'Alcaldia de Manapiare', 'Instancia municipal de atencion y enlace comunitario para la proteccion de los derechos de las mujeres en comunidades indigenas y rurales del Alto Ventuari.', 'Sede de la Alcaldia del Municipio Manapiare, San Juan de Manapiare, Estado Amazonas.', 5.333300, -66.083300, 'OTRA'),
    (ARRAY[4], 2, 4, 'Sede INAMUJER Barcelona', 'Oficina regional para la recepcion de denuncias por violencia de genero, orientacion legal y articulacion con los cuerpos de seguridad del area metropolitana.', 'Casco Central de Barcelona, Sede Regional INAMUJER, Municipio Simon Bolivar, Barcelona 6001, Estado Anzoategui.', 10.138800, -64.695700, 'INAMUJER'),
    (ARRAY[5], 2, 13, 'Circuito Judicial Penal El Tigre', 'Enlace de defensoria adscrito a los tribunales penales para la proteccion de derechos y acompanamiento procesal en casos de violencia de genero.', 'Av. Francisco de Miranda, Circuito Judicial Penal, El Tigre 6030, Estado Anzoategui.', 8.885800, -64.258600, 'OTRA'),
    (ARRAY[6], 2, 14, 'CAFIM Puerto La Cruz', 'Centro de atencion integral con asesoria juridica gratuita, contencion psicologica y formacion socioproductiva para mujeres en situacion de vulnerabilidad.', 'Av. Municipal, Sede CAFIM Puerto La Cruz, Municipio Sotillo, Puerto La Cruz 6023, Estado Anzoategui.', 10.211700, -64.632200, 'OTRA'),
    (ARRAY[7], 2, 15, 'Circuito Judicial Penal Guanipa', 'Unidad de apoyo judicial y defensoria para canalizar medidas de proteccion, dar seguimiento a expedientes y ofrecer atencion juridica en el eje Guanipa-El Tigre.', 'Sector San Jose de Guanipa, Extension del Circuito Judicial Penal, Municipio Guanipa, El Tigre 6032, Estado Anzoategui.', 8.871200, -64.155400, 'OTRA'),
    (ARRAY[8], 2, 20, 'CAFIM Santa Ana', 'Punto municipal de atencion integral para prevenir la violencia de genero, orientar a familias y promover los derechos de las mujeres.', 'Casco Central de Santa Ana, Sede CAFIM Municipal, Municipio Santa Ana, Estado Anzoategui.', 9.761400, -64.338100, 'OTRA'),
    (ARRAY[9], 3, 29, 'CAFIM Biruaca', 'Centro multidisciplinario de atencion juridica, contencion psicologica, orientacion social y prevencion de la violencia de genero.', 'Casco Central de Biruaca, Sede CAFIM, Municipio Biruaca, Biruaca 5102, Estado Apure.', 7.834500, -67.548100, 'OTRA'),
    (ARRAY[10], 3, 23, 'Instituto Municipal de la Mujer Achaguas', 'Instancia municipal para la defensa de los derechos de las mujeres, recepcion de casos de violencia de genero y asesoria legal.', 'Sede de la Alcaldia / Instituto Municipal de la Mujer, Achaguas 5111, Estado Apure.', 7.747900, -68.217800, 'OTRA'),
    (ARRAY[11], 3, 25, 'Instituto Municipal de la Mujer Paez', 'Oficina de proteccion y apoyo integral a la mujer en la zona fronteriza del Alto Apure, orientada a la atencion de victimas y promocion de derechos humanos.', 'Casco Central de Guasdualito, Sede Municipal, Municipio Paez, Guasdualito 5011, Estado Apure.', 7.241800, -70.781600, 'OTRA'),
    (ARRAY[12], 3, 28, 'Instituto Municipal de la Mujer San Fernando', 'Instancia municipal para la atencion integral, recepcion de denuncias, orientacion legal y acompanamiento psicosocial en la capital del estado.', 'Av. Carabobo, Sede del Instituto Municipal de la Mujer, Municipio San Fernando, San Fernando de Apure 3001, Estado Apure.', 7.887800, -67.471700, 'OTRA'),
    (ARRAY[13], 3, 27, 'Instituto Municipal de la Mujer Romulo Gallegos', 'Oficina municipal de atencion, prevencion y resguardo de los derechos de las mujeres en la region sur-occidental.', 'Casco Central de Elorza, Sede Municipal, Municipio Romulo Gallegos, Elorza 5013, Estado Apure.', 7.418200, -69.492700, 'OTRA'),
    (ARRAY[14], 4, 30, 'CAFIM y UAIM Maracay', 'Centro integral y unidad de atencion hospitalaria que brindan asesoria juridica, defensa de derechos, contencion psicologica y atencion especializada ante la violencia de genero.', 'Sede Central CAFIM y UAIM, Maracay 2101, Estado Aragua.', 10.246900, -67.595800, 'OTRA'),
    (ARRAY[15], 4, 30, 'Centro de Asunto para la Mujer Maracay', 'Oficina de orientacion, recepcion de casos y seguimiento a denuncias de mujeres en situacion de vulnerabilidad.', 'Casco Central de Maracay, Municipio Girardot, Maracay 2101, Estado Aragua.', 10.250100, -67.599100, 'OTRA'),
    (ARRAY[16], 4, 35, 'Centro de Asunto para la Mujer Cagua', 'Instancia municipal para la defensa de los derechos de la mujer, asesoria legal gratuita y atencion psicosocial.', 'Casco Central de Cagua, Sede Municipal, Municipio Sucre, Cagua 2122, Estado Aragua.', 10.183400, -67.462300, 'OTRA'),
    (ARRAY[17], 4, 46, 'Centro de Asunto para la Mujer Santa Rita', 'Instancia comunitaria y municipal de asesoria legal, apoyo psicologico y articulacion defensiva para las mujeres de la localidad.', 'Casco Central de Santa Rita, Sede Municipal, Municipio Francisco Linares Alcantara, Santa Rita 2105, Estado Aragua.', 10.228900, -67.534200, 'OTRA'),
    (ARRAY[18], 4, 42, 'Centro de Asunto para la Mujer El Limon', 'Oficina de atencion y proteccion a la mujer, orientada a prevenir la violencia de genero y canalizar denuncias en el eje norte del estado.', 'Av. Principal de El Limon, Sede Municipal, Municipio Mario Briceno Iragorry, El Limon 2103, Estado Aragua.', 10.297100, -67.618400, 'OTRA'),
    (ARRAY[19], 4, 30, 'UAIM Hospital Central de Maracay', 'Unidad de atencion integral ubicada en el principal centro de salud del estado, con atencion medica, apoyo ginecologico, orientacion legal y resguardo ante agresiones.', 'Av. Jose Casanova Godoy, Hospital Central de Maracay, Maracay 2101, Estado Aragua.', 10.256140, -67.575220, 'OTRA'),
    (ARRAY[20, 21, 24, 25], 5, 49, 'CAFIM Barinas', 'Centro de atencion y defensoria integral para la recepcion de casos, orientacion juridica, apoyo psicosocial, seguimiento de medidas de proteccion y promocion de derechos.', 'Casco Central de Barinas, Sede CAFIM, Municipio Barinas, Barinas 5201, Estado Barinas.', 8.622600, -70.207500, 'OTRA'),
    (ARRAY[22], 5, 51, 'Instituto Municipal de la Mujer Santa Barbara', 'Instancia municipal para brindar orientacion legal, apoyo psicosocial y canalizacion de denuncias en el sur-oeste de Barinas.', 'Casco Central de Santa Barbara, Sede del Instituto Municipal de la Mujer, Municipio Ezequiel Zamora, Santa Barbara 5216, Estado Barinas.', 7.813600, -71.174400, 'OTRA'),
    (ARRAY[23], 5, 53, 'Casa de Abrigo Municipal Pedraza', 'Espacio de resguardo, acogida temporal y proteccion integral para mujeres y sus hijos en situacion de riesgo o violencia extrema.', 'Casco Central de Ciudad Bolivia, Sede de la Casa de Abrigo Municipal, Municipio Pedraza, Ciudad Bolivia 5212, Estado Barinas.', 8.342200, -70.669400, 'OTRA'),
    (ARRAY[27, 29, 30, 31, 34, 35], 6, 60, 'CAFIM Caroni Ciudad Guayana', 'Centro multidisciplinario de atencion juridica gratuita, apoyo psicosocial, orientacion y formacion socioproductiva para mujeres en Ciudad Guayana.', 'Sector Alta Vista / Puerto Ordaz o San Felix, Sede CAFIM Caroni, Ciudad Guayana 8050, Estado Bolivar.', 8.299400, -62.735600, 'OTRA'),
    (ARRAY[33], 6, 62, 'CAFIM Angostura del Orinoco', 'Espacio de atencion y formacion integral para la mujer, orientado a la defensa legal, el apoyo psicologico y la prevencion de la violencia de genero.', 'Casco Historico / Av. Germania, Sede CAFIM Ciudad Bolivar, Ciudad Bolivar 8001, Estado Bolivar.', 8.129200, -63.540900, 'OTRA'),
    (ARRAY[28, 36], 6, 62, 'Camara Municipal Angostura del Orinoco', 'Enlace institucional legislativo y municipal para impulsar la igualdad de genero, recibir casos y articular la defensa de los derechos de las mujeres.', 'Sede del Concejo Municipal / Camara Municipal, Plaza Bolivar, Ciudad Bolivar 8001, Estado Bolivar.', 8.144400, -63.547200, 'OTRA'),
    (ARRAY[32], 6, 65, 'Alcaldia del Municipio Sucre Maripa', 'Oficina municipal para canalizar la atencion, orientacion y proteccion de los derechos de la mujer en la cuenca del Caura.', 'Sede de la Alcaldia del Municipio Sucre, Calle Principal, Maripa, Estado Bolivar.', 7.434200, -65.146900, 'OTRA'),
    (ARRAY[26], 6, 68, 'Enlace regional Gran Sabana', 'Punto de enlace institucional para la atencion, orientacion legal y resguardo de los derechos de las mujeres en Santa Elena de Uairen y comunidades de la Gran Sabana.', 'Sede de la Gobernacion / Enlace Regional, Santa Elena de Uairen 8014, Estado Bolivar.', 4.602200, -61.107500, 'OTRA'),
    (ARRAY[37, 38, 39], 7, 79, 'Circuito Judicial Penal Carabobo', 'Enlace de defensoria adscrito a tribunales especializados para el acompanamiento juridico procesal, asesoria legal y seguimiento de medidas de proteccion.', 'Av. Fernando Figueredo, Circuito Judicial Penal del Estado Carabobo (Palacio de Justicia de Valencia), Parroquia La Candelaria, Valencia 2001, Estado Carabobo.', 10.175500, -67.997800, 'OTRA'),
    (ARRAY[40], 7, 77, 'Instituto Municipal para la Mujer Puerto Cabello', 'Instancia municipal de atencion integral, recepcion de casos, orientacion legal, apoyo psicosocial y prevencion de la violencia contra la mujer.', 'Casco Central / Av. Bolivar, Sede del Instituto Municipal para la Mujer, Municipio Puerto Cabello, Puerto Cabello 2050, Estado Carabobo.', 10.473100, -68.012500, 'OTRA'),
    (ARRAY[41, 42, 43], 8, 90, 'UAIM y Circuito Judicial Penal Cojedes', 'Articulacion de atencion integral a la mujer, enlace judicial y coordinacion ministerial para orientacion juridica, acompanamiento procesal, apoyo psicosocial y canalizacion de casos.', 'Casco Central / Av. Ricaurte o Sede del Circuito Judicial Penal / Sede Ministerial, San Carlos 2201, Estado Cojedes.', 9.661200, -68.582700, 'OTRA'),
    (ARRAY[44, 45, 46], 23, 331, 'Instituto Regional de la Mujer Tucupita', 'Instancia regional que coordina politicas de igualdad y proteccion, ofrece orientacion juridica, apoyo psicosocial, recibe casos y articula instituciones.', 'Casco Central de Tucupita, Sede del Instituto Regional de la Mujer, Municipio Tucupita, Tucupita 6401, Estado Delta Amacuro.', 9.062200, -62.051100, 'OTRA'),
    (ARRAY[47], 23, 334, 'Casa de la Mujer Pedernales', 'Espacio de atencion, orientacion social, apoyo legal y prevencion de la violencia de genero para las mujeres del municipio y comunidades del Bajo Delta.', 'Casco Central de Pedernales, Sede de la Casa de la Mujer, Municipio Pedernales, Pedernales 6404, Estado Delta Amacuro.', 9.974200, -62.248100, 'OTRA'),
    (ARRAY[48, 49], 9, 103, 'CAFIM Coro', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social y prevencion de la violencia de genero.', 'Casco Central / Av. Manaure o Sector Centro, Sede CAFIM Coro, Santa Ana de Coro 4101, Estado Falcon.', 11.404500, -69.673400, 'OTRA'),
    (ARRAY[50], 9, 102, 'Sede Municipal de la Mujer Mauroa', 'Oficina municipal para la recepcion de casos, acompanamiento legal y social y promocion de la igualdad de genero en el occidente falconiano.', 'Casco Central de Mene de Mauroa, Sede Municipal de la Mujer, Municipio Mauroa, Mene de Mauroa 4152, Estado Falcon.', 10.674200, -71.028900, 'OTRA'),
    (ARRAY[51], 9, 97, 'Banco de la Mujer Punto Fijo', 'Punto de enlace para el empoderamiento socioeconomico, financiamiento socioproductivo y acompanamiento a mujeres emprendedoras y usuarias del sistema de proteccion.', 'Sector Centro / Av. Jacinto Lara o Casco Central de Punto Fijo, Sede / Enlace Banco de Desarrollo de la Mujer (BanMujer), Municipio Carirubana, Punto Fijo 4102, Estado Falcon.', 11.693900, -70.194700, 'OTRA'),
    (ARRAY[52, 53], 10, 124, 'CAFIM San Juan de los Morros', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social y prevencion de la violencia basada en genero.', 'Casco Central / Av. Bolivar o Sector Centro, Sede CAFIM San Juan de los Morros, Municipio Juan German Roscio, San Juan de los Morros 2301, Estado Guarico.', 9.911500, -67.353800, 'OTRA'),
    (ARRAY[54], 10, 119, 'Instituto Municipal de la Mujer Valle de la Pascua', 'Instancia municipal para la recepcion de casos, acompanamiento legal, orientacion social y promocion de la igualdad de genero en el oriente guariqueno.', 'Casco Central de Valle de la Pascua, Sede del Instituto Municipal de la Mujer, Municipio Leonardo Infante, Valle de la Pascua 2350, Estado Guarico.', 9.215600, -66.007200, 'OTRA'),
    (ARRAY[55, 56, 57, 58], 24, 335, 'Sede de Guaicaipuro La Guaira', 'Oficina de atencion adscrita a la Defensora Nacional de los Derechos de la Mujer para recepcion de casos, orientacion juridica, apoyo psicosocial y seguimiento de medidas de proteccion.', 'Sede de Guaicaipuro, Piso 2, Edificio PDVAL, Municipio Vargas, Estado La Guaira.', 10.599000, -66.934600, 'OTRA'),
    (ARRAY[59, 60], 11, 135, 'CAFIM Barquisimeto', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social y prevencion de la violencia basada en genero.', 'Casco Central / Av. Venezuela o Sector Coromoto, Sede CAFIM Iribarren, Barquisimeto 3001, Estado Lara.', 10.067800, -69.347400, 'OTRA'),
    (ARRAY[61, 62], 11, 135, 'Circuito Judicial Penal Lara', 'Enlace de defensoria para acompanamiento juridico procesal, asesoria legal gratuita y seguimiento de medidas de proteccion en Barquisimeto.', 'Carrera 15 con Calle 25, Circuito Judicial Penal del Estado Lara, Parroquia Catedral, Barquisimeto 3001, Estado Lara.', 10.064200, -69.322800, 'OTRA'),
    (ARRAY[64, 65], 11, 140, 'UAIM Hospital de Siquisique', 'Unidad de atencion integral ubicada en el centro hospitalario, con orientacion medica, apoyo psicosocial, defensa de derechos y canalizacion de casos de violencia de genero.', 'Hospital de Siquisique, Municipio Urdaneta, Siquisique 3051, Estado Lara.', 10.578900, -69.723600, 'OTRA'),
    (ARRAY[63], 11, 142, 'CAFIM Sarare', 'Centro de atencion y formacion integral para la mujer orientado a la atencion de victimas, asesoria juridica, apoyo psicologico y prevencion de la violencia de genero.', 'Casco Central de Sarare, Sede CAFIM, Municipio Simon Planas, Sarare 3022, Estado Lara.', 9.796100, -69.183900, 'OTRA'),
    (ARRAY[66, 67, 68, 69, 70, 71], 12, 150, 'CAFIM Merida', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social, seguimiento de medidas de proteccion y prevencion de la violencia de genero.', 'Casco Central / Av. 2 Lora o Sector Centro, Sede CAFIM Merida, Municipio Libertador, Merida 5101, Estado Merida.', 8.589600, -71.156100, 'OTRA'),
    (ARRAY[75], 13, 166, 'Instituto Municipal de la Mujer Caucagua', 'Instancia municipal para recepcion de casos, orientacion juridica, apoyo psicosocial y prevencion de la violencia de genero en Barlovento.', 'Casco Central de Caucagua, Sede del Instituto Municipal de la Mujer, Municipio Acevedo, Caucagua 1246, Estado Miranda.', 10.281900, -66.374200, 'OTRA'),
    (ARRAY[72, 74], 13, 167, 'CAFIM Argelia Laya Higuerote', 'Centro multidisciplinario de atencion y formacion integral para brindar asesoria juridica gratuita, contencion psicologica, apoyo social y formacion socioproductiva.', 'Casco Central / Av. Bolivar o Sector Centro de Higuerote, Sede CAFIM Argelia Laya, Municipio Brion, Higuerote 1224, Estado Miranda.', 10.487800, -66.101400, 'OTRA'),
    (ARRAY[76], 13, 168, 'UAIM Cacica Urquia Los Teques', 'Unidad de atencion integral en el principal centro hospitalario de los Altos Mirandinos, con atencion medica, orientacion legal, apoyo psicosocial y resguardo.', 'Av. Bicentenario, Hospital General Dr. Victorino Santaella Ruiz, Los Teques 1201, Estado Miranda.', 10.343530, -67.037860, 'OTRA'),
    (ARRAY[81, 82, 85], 13, 170, 'CIAC Apacuana Ocumare del Tuy', 'Centro integral de atencion y acompanamiento para la defensa de derechos, orientacion juridica, apoyo psicologico y canalizacion de denuncias.', 'Casco Central de Ocumare del Tuy, Sede CIAC Apacuana, Municipio Tomas Lander, Ocumare del Tuy 1209, Estado Miranda.', 10.118900, -66.770300, 'OTRA'),
    (ARRAY[77], 13, 172, 'UAIM Hermanas Mirabal Santa Lucia', 'Unidad de atencion integral dedicada a la orientacion juridica, contencion psicosocial, defensa de derechos y prevencion de violencia contra la mujer.', 'Casco Central de Santa Lucia del Tuy, Sede UAIM Hermanas Mirabal, Municipio Paz Castillo, Santa Lucia 1230, Estado Miranda.', 10.214700, -66.662500, 'OTRA'),
    (ARRAY[78], 13, 173, 'UAIM Elisa Jimenez Guarenas', 'Unidad de atencion integral con asesoria legal, orientacion psicologica, apoyo social y articulacion con redes de justicia y salud.', 'Casco Central / Av. Intercomunal Guarenas-Guatire, Sede UAIM Elisa Jimenez, Municipio Plaza, Guarenas 1220, Estado Miranda.', 10.469200, -66.607800, 'OTRA'),
    (ARRAY[79], 13, 173, 'UAIM Plaza Zamora Guarenas', 'Unidad de atencion y defensoria para recepcion de casos, acompanamiento juridico y promocion de la igualdad de genero.', 'Zona Plaza Zamora / Centro de Guarenas, Municipio Plaza, Guarenas 1220, Estado Miranda.', 10.468500, -66.609100, 'OTRA'),
    (ARRAY[80, 84], 13, 175, 'UAIM Cacica Apacuana Cua', 'Unidad de atencion integral para orientacion juridica gratuita, contencion psicosocial, defensa de derechos y prevencion de violencia de genero.', 'Casco Central de Cua, Sede UAIM Cacica Apacuana, Municipio Urdaneta, Cua 1211, Estado Miranda.', 10.161400, -66.886100, 'OTRA'),
    (ARRAY[83], 13, 182, 'UAIM Maternidad de Carrizal', 'Unidad de atencion integral en el ambito materno-asistencial para la proteccion, orientacion legal y acompanamiento de mujeres gestantes y usuarias vulnerables.', 'Sector Montana Alta / Av. Principal, Maternidad de Carrizal, Municipio Carrizal, Carrizal 1203, Estado Miranda.', 10.348900, -66.985300, 'OTRA'),
    (ARRAY[73], 13, 183, 'CAFIM Chacao y Casa de Justicia y Paz', 'Centro de atencion y formacion integral articulado con la Casa de Justicia y Paz, con orientacion juridica, resolucion pacifica de conflictos, apoyo psicologico y defensa de derechos.', 'Municipio Chacao, Eje Metropolitano de Caracas, Estado Miranda.', 10.496800, -66.853600, 'OTRA'),
    (ARRAY[86, 88], 14, 193, 'Sede Ministerial Maturin', 'Oficina ministerial regional para coordinar politicas de igualdad y proteccion, orientar juridicamente, recibir denuncias y articular instituciones.', 'Casco Central / Av. Bicentenario o Sector Centro, Sede Ministerial de Atencion a la Mujer, Municipio Maturin, Maturin 6201, Estado Monagas.', 9.745690, -63.183230, 'MINISTERIO'),
    (ARRAY[87, 89], 14, 193, 'Palacio de Justicia Maturin', 'Enlace de defensoria para acompanamiento juridico procesal, asesoria legal y seguimiento de medidas de proteccion en causas de violencia contra la mujer.', 'Av. Raul Leoni, Palacio de Justicia del Estado Monagas, Parroquia Boqueron, Municipio Maturin, Maturin 6201, Estado Monagas.', 9.736800, -63.164200, 'OTRA'),
    (ARRAY[90], 15, 200, 'Sede Ministerial La Asuncion', 'Oficina regional para coordinar politicas de igualdad y proteccion, brindar orientacion juridica, recibir denuncias y articular instituciones.', 'Casco Historico de La Asuncion, Sede Ministerial de Atencion a la Mujer, Municipio Arismendi, La Asuncion 6311, Estado Nueva Esparta.', 11.033300, -63.862800, 'MINISTERIO'),
    (ARRAY[91], 15, 201, 'Sede Ministerial San Juan Bautista', 'Punto de atencion y coordinacion para la defensa de derechos, asesoria legal, apoyo psicologico y canalizacion de casos de violencia de genero.', 'Casco Central de San Juan Bautista, Sede Ministerial de Atencion a la Mujer, Municipio Diaz, San Juan Bautista 6315, Estado Nueva Esparta.', 11.008900, -63.937800, 'MINISTERIO'),
    (ARRAY[92, 93, 94], 16, 213, 'CAFIM Guanare', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social, seguimiento de medidas de proteccion y prevencion de la violencia de genero.', 'Casco Central / Av. Unda o Sector Centro de Guanare, Sede CAFIM Guanare, Municipio Guanare, Guanare 3350, Estado Portuguesa.', 9.041800, -69.742100, 'OTRA'),
    (ARRAY[100, 102, 103], 1, 1, 'Sede Central de la Defensoria Nacional', 'Sede central de coordinacion nacional y metropolitana para recepcion de casos, orientacion juridica, apoyo psicosocial, defensa de derechos y articulacion institucional.', 'Sede Central Ministerial / Defensora Nacional de los Derechos de la Mujer, Caracas 1010, Distrito Capital.', 10.506100, -66.914600, 'OTRA'),
    (ARRAY[105], 1, 1, 'Sede Central Parroquia Candelaria', 'Punto de atencion y enlace operativo para orientacion legal, acompanamiento a usuarias, seguimiento de denuncias y defensa de derechos.', 'Parroquia Candelaria / Sede Central, Caracas 1010, Distrito Capital.', 10.503800, -66.906900, 'OTRA'),
    (ARRAY[101], 1, 1, 'Sede Central Parroquia San Pedro', 'Enlace y oficina de atencion integral enfocada en orientacion juridica, apoyo psicologico y resguardo de los derechos de la mujer.', 'Parroquia San Pedro / Sede Central, Caracas 1050, Distrito Capital.', 10.489200, -66.898600, 'OTRA'),
    (ARRAY[99], 1, 1, 'Sede Central Parroquia Macarao', 'Punto de atencion y defensoria para brindar orientacion legal, contencion social y canalizacion de casos de violencia de genero.', 'Parroquia Macarao / Sede Central, Caracas 1102, Distrito Capital.', 10.436900, -67.039400, 'OTRA'),
    (ARRAY[96], 1, 1, 'Sede Central Materno Hugo Chavez', 'Unidad de enlace articulada con el centro materno-infantil para acompanamiento asistencial, orientacion legal y proteccion de mujeres gestantes y madres vulnerables.', 'Hospital Materno Infantil Hugo Chavez Frias, Parroquia El Valle, Caracas 1090, Distrito Capital.', 10.461400, -66.906100, 'OTRA'),
    (ARRAY[97], 1, 1, 'Materno Infantil Pastor Oropeza', 'Punto de atencion y proteccion en el ambito materno-infantil para atencion integral, orientacion juridica y contencion.', 'Hospital Materno Infantil Pastor Oropeza, Parroquia Caricuao, Caracas 1100, Distrito Capital.', 10.433900, -66.976400, 'OTRA'),
    (ARRAY[106], 1, 1, 'UAIM Maternidad Concepcion Palacios', 'Unidad de atencion integral con atencion gineco-obstetrica, orientacion legal gratuita, apoyo psicosocial y resguardo a mujeres en situacion de violencia o riesgo.', 'Av. San Martin, Maternidad Concepcion Palacios, Parroquia San Juan, Caracas 1010, Distrito Capital.', 10.494400, -66.929700, 'OTRA'),
    (ARRAY[98, 104], 1, 1, 'Circuito Judicial Penal Caracas', 'Enlace de defensoria adscrito a tribunales especializados para acompanamiento juridico procesal, asesoria legal y seguimiento de medidas de proteccion.', 'Esquina de Pajaritos / Av. Universidad, Circuito Judicial Penal del Area Metropolitana de Caracas, Parroquia Catedral, Caracas 1010, Distrito Capital.', 10.504200, -66.915800, 'OTRA'),
    (ARRAY[107], 1, 1, 'Sala de Autogobierno Parroquia Catedral', 'Espacio de articulacion comunal y territorial para la prevencion de la violencia basada en genero, orientacion comunitaria y canalizacion de casos.', 'Parroquia Catedral / Sala de Autogobierno, Casco Central de Caracas 1010, Distrito Capital.', 10.504700, -66.914200, 'OTRA'),
    (ARRAY[95], 1, 1, 'Sala de Autogobierno Antimano', 'Instancia territorial para la defensa de los derechos de las mujeres, recepcion de casos y coordinacion comunitaria.', 'Parroquia Antimano / Sala de Autogobierno, Caracas 1101, Distrito Capital.', 10.464200, -66.985800, 'OTRA'),
    (ARRAY[108], 1, 1, 'Sala de Autogobierno Nuevo Catuche', 'Punto de enlace comunitario y proteccion a la mujer enfocado en orientacion, apoyo social y prevencion de violencias en el ambito familiar y comunal.', 'Sector Nuevo Catuche, Parroquia La Pastora, Caracas 1010, Distrito Capital.', 10.517200, -66.912800, 'OTRA'),
    (ARRAY[109], 1, 1, 'Centro de Atencion Integral Casa Obrero', 'Centro integral de atencion y formacion para ofrecer asesoria juridica gratuita, contencion psicologica, orientacion social y prevencion de violencia contra la mujer.', 'Parroquia Sucre (Catia), Centro de Atencion Integral para la Mujer Casa Obrero, Caracas 1030, Distrito Capital.', 10.513600, -66.942500, 'OTRA'),
    (ARRAY[110, 112, 113, 114], 17, 233, 'Sede Ministerial Cumana', 'Oficina regional para coordinar politicas de igualdad y proteccion, brindar orientacion juridica, recibir denuncias y articular instituciones.', 'Casco Central / Av. Bermudez o Sector Centro, Sede Ministerial de Atencion a la Mujer, Municipio Sucre, Cumana 6101, Estado Sucre.', 10.453900, -64.182500, 'MINISTERIO'),
    (ARRAY[111], 17, 227, 'Sede Funda Bermudez Carupano', 'Punto de enlace y atencion para la defensa de los derechos de la mujer, orientacion social, apoyo legal y prevencion de la violencia de genero en el eje de Paria.', 'Casco Central de Carupano, Sede Funda Bermudez, Municipio Bermudez, Carupano 6150, Estado Sucre.', 10.667800, -63.248100, 'OTRA'),
    (ARRAY[115], 17, 231, 'Instituto de la Mujer Cariaco', 'Instancia municipal para atencion integral, recepcion de casos, orientacion juridica, acompanamiento psicosocial y promocion de derechos.', 'Casco Central de Cariaco, Sede del Instituto de la Mujer, Municipio Ribero, Cariaco 6152, Estado Sucre.', 10.493600, -63.550800, 'OTRA'),
    (ARRAY[117, 118], 18, 247, 'CAFIM San Cristobal', 'Centro multidisciplinario de atencion integral con orientacion juridica gratuita, contencion psicologica, apoyo social y prevencion de la violencia basada en genero.', 'Casco Central / Av. 19 de Abril o Sector Barrio Obrero, Sede CAFIM San Cristobal, Municipio San Cristobal, San Cristobal 5001, Estado Tachira.', 7.766900, -72.225800, 'OTRA'),
    (ARRAY[116], 18, 251, 'CAFIM Municipio 251 Tachira', 'Centro de atencion y formacion integral para la recepcion de casos, asesoria legal, apoyo psicosocial y defensa de derechos en su jurisdiccion municipal.', 'Sede CAFIM, Municipio ID 251, Estado Tachira. Coordenadas referenciales de San Cristobal; confirmar municipio y ubicacion exacta.', 7.766900, -72.225800, 'OTRA'),
    (ARRAY[120], 19, 275, 'Instituto Municipal de la Mujer Bocono', 'Instancia municipal para recepcion de casos, orientacion juridica, apoyo psicosocial y prevencion de la violencia de genero.', 'Casco Central de Bocono, Oficina del Instituto Municipal de la Mujer, Municipio Bocono, Bocono 3102, Estado Trujillo.', 9.248900, -70.254700, 'OTRA'),
    (ARRAY[121], 19, 270, 'Sede Ministerial Municipio 270 Trujillo', 'Enlace ministerial para orientacion juridica, contencion psicosocial, recepcion de denuncias y canalizacion de casos en su jurisdiccion.', 'Sede Ministerial de Atencion a la Mujer, Municipio ID 270, Estado Trujillo. Coordenadas referenciales de Trujillo capital; confirmar municipio y ubicacion exacta.', 10.158100, -70.436700, 'MINISTERIO'),
    (ARRAY[119], 19, 288, 'Sede Ministerial Municipio 288 Trujillo', 'Enlace ministerial para defensa de derechos, acompanamiento legal, apoyo social y articulacion con redes de proteccion en su jurisdiccion.', 'Sede Ministerial de Atencion a la Mujer, Municipio ID 288, Estado Trujillo. Coordenadas referenciales de Trujillo capital; confirmar municipio y ubicacion exacta.', 10.158100, -70.436700, 'MINISTERIO'),
    (ARRAY[122], 20, 292, 'Circuito Judicial Penal Yaracuy', 'Enlace de defensoria para acompanamiento juridico procesal, asesoria legal gratuita y seguimiento de medidas de proteccion.', 'Av. Cartagena / Sector Centro, Circuito Judicial Penal del Estado Yaracuy (Sede Central), Municipio San Felipe, San Felipe 3201, Estado Yaracuy.', 10.339900, -68.742500, 'OTRA'),
    (ARRAY[123, 124], 20, 292, 'Sede Ministerial San Felipe', 'Oficina regional para coordinar politicas de igualdad y proteccion, brindar orientacion juridica y articular instituciones.', 'Casco Central / Av. Yaracuy o Sector Centro, Sede Ministerial de Atencion a la Mujer, Municipio San Felipe, San Felipe 3201, Estado Yaracuy.', 10.337600, -68.744100, 'MINISTERIO'),
    (ARRAY[125, 126, 128, 129], 21, 307, 'Sede INAMUJER Municipio 307 Zulia', 'Sede regional del Instituto Nacional de la Mujer para coordinacion de politicas de igualdad y proteccion, orientacion juridica, recepcion de casos y seguimiento de medidas.', 'Sede Regional INAMUJER, Municipio ID 307, Estado Zulia. Coordenadas referenciales del area metropolitana de Maracaibo; confirmar municipio y ubicacion exacta.', 10.642700, -71.612500, 'INAMUJER'),
    (ARRAY[131], 21, 310, 'Sede INAMUJER Machiques', 'Oficina de enlace para atencion integral, orientacion legal, apoyo psicosocial y defensa de los derechos de las mujeres en Machiques.', 'Casco Central de Machiques, Sede INAMUJER, Municipio Machiques de Perija, Machiques 4021, Estado Zulia.', 10.061700, -72.551400, 'INAMUJER'),
    (ARRAY[132], 21, 310, 'Alcaldia de Machiques', 'Punto de atencion y articulacion interinstitucional para recepcion de casos, acompanamiento legal y social y promocion de la igualdad de genero.', 'Sede de la Alcaldia del Municipio Machiques de Perija, Casco Central de Machiques 4021, Estado Zulia.', 10.062500, -72.552200, 'OTRA'),
    (ARRAY[130], 21, 318, 'Sede INAMUJER Municipio 318 Zulia', 'Enlace territorial del Instituto Nacional de la Mujer para orientacion juridica, apoyo psicosocial, defensa de derechos y canalizacion de casos.', 'Sede INAMUJER, Municipio ID 318, Estado Zulia. Coordenadas referenciales del area metropolitana de Maracaibo; confirmar municipio y ubicacion exacta.', 10.642700, -71.612500, 'INAMUJER'),
    (ARRAY[127], 21, 320, 'Sede INAMUJER Municipio 320 Zulia', 'Oficina de atencion y defensoria para recepcion de denuncias, asesoria legal gratuita, apoyo social y prevencion de violencia de genero.', 'Sede INAMUJER, Municipio ID 320, Estado Zulia. Coordenadas referenciales del area metropolitana de Maracaibo; confirmar municipio y ubicacion exacta.', 10.642700, -71.612500, 'INAMUJER'),
    (ARRAY[133], 21, 306, 'Instituto Municipal de la Mujer Municipio 306 Zulia', 'Instancia municipal para ejecutar politicas locales de proteccion, orientacion legal, apoyo psicosocial y promocion de los derechos de las mujeres.', 'Sede del Instituto Municipal de la Mujer, Municipio ID 306, Estado Zulia. Coordenadas referenciales del area metropolitana de Maracaibo; confirmar municipio y ubicacion exacta.', 10.642700, -71.612500, 'OTRA');

CREATE TEMP TABLE directorios_suministrados AS
SELECT
    fuente_id,
    estado_id,
    municipio_id,
    organismo,
    descripcion,
    direccion,
    latitud,
    longitud,
    tipo_organismo
FROM centros_suministrados s
CROSS JOIN LATERAL unnest(s.fuente_ids) AS ids(fuente_id);

DO $$
DECLARE
    total_suministrados integer;
    total_directorios integer;
    total_actualizados integer;
    total_prueba integer;
BEGIN
    SELECT count(*) INTO total_suministrados FROM directorios_suministrados;
    IF total_suministrados <> 133
       OR (SELECT count(DISTINCT fuente_id) FROM directorios_suministrados) <> 133
       OR (SELECT min(fuente_id) FROM directorios_suministrados) <> 1
       OR (SELECT max(fuente_id) FROM directorios_suministrados) <> 133 THEN
        RAISE EXCEPTION 'La carga debe incluir una sola ubicacion para cada fuente_id del directorio entre 1 y 133.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM directorios_suministrados s
        LEFT JOIN municipios m ON m.id = s.municipio_id
        LEFT JOIN estados e ON e.id = s.estado_id
        WHERE m.id IS NULL OR e.id IS NULL OR m.estado_id <> s.estado_id
    ) THEN
        RAISE EXCEPTION 'Hay municipio_id o estado_id inexistentes o incompatibles en los datos suministrados.';
    END IF;

    SELECT count(*) INTO total_directorios
    FROM centros c
    JOIN directorios_suministrados s ON s.fuente_id = c.fuente_id
    WHERE c.fuente = 'DIRECTORIO'
      AND c.tipo_registro = 'DIRECTORIO';

    IF total_directorios <> 133 THEN
        RAISE EXCEPTION 'Se esperaban los 133 directorios fuente. Ejecute insert_directorios.sql y verifique antes de continuar.';
    END IF;

    CREATE TEMP TABLE centros_prueba_esperados (
        fuente_id integer PRIMARY KEY,
        nombre varchar NOT NULL
    ) ON COMMIT DROP;

    INSERT INTO centros_prueba_esperados VALUES
        (1, 'Instituto Nacional de la Mujer'),
        (2, 'MinPPmujer'),
        (3, 'Instituto de la Mujer'),
        (4, 'Instituto de la Mujer Municipio Sucre'),
        (5, 'Centro de Atencion Integral Venezuela Mujer-Inamujer Zulia'),
        (6, 'INAMUJER'),
        (7, 'Centro de Atencion y Formacion Integral para la Mujer'),
        (8, 'IREMUJER'),
        (9, 'IMA (Instituto de la Mujer en Aragua)'),
        (10, 'Instituto Autonomo de la Mujer Mama Rosa'),
        (11, 'INTAMUJER'),
        (12, 'IREMUJER'),
        (13, 'Instituto Regional de la Mujer Barinas'),
        (14, 'Instituto Merideño de La Mujer y Familia'),
        (15, 'Instituto Municipal de la Mujer (Immujer) Paez'),
        (16, 'Instituto Estadal de la Mujer y Familia'),
        (17, 'Instituto Nacional de la Mujer'),
        (18, 'Instituto Municipal de la Mujer Guaaribe'),
        (19, 'MINMUJER');

    SELECT count(*) INTO total_prueba
    FROM centros c
    WHERE c.tipo_registro = 'MAPA'
      AND c.fuente = 'CENTRO_ATENCION'
      AND c.fuente_id BETWEEN 1 AND 19;

    IF total_prueba NOT IN (0, 19) THEN
        RAISE EXCEPTION 'Se encontraron % de los 19 centros de prueba. La limpieza se cancela para evitar borrar un conjunto parcial.', total_prueba;
    END IF;

    IF total_prueba = 19 AND EXISTS (
        SELECT 1
        FROM centros c
        JOIN centros_prueba_esperados p ON p.fuente_id = c.fuente_id
        WHERE c.tipo_registro = 'MAPA'
          AND c.fuente = 'CENTRO_ATENCION'
          AND c.nombre <> p.nombre
    ) THEN
        RAISE EXCEPTION 'Los registros MAPA 1-19 no coinciden con los nombres de prueba conocidos. Revise manualmente antes de limpiar.';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM centros c
        JOIN servicios_centro x ON x.centro_id = c.id
        WHERE c.tipo_registro = 'MAPA' AND c.fuente = 'CENTRO_ATENCION' AND c.fuente_id BETWEEN 1 AND 19
        UNION ALL
        SELECT 1
        FROM centros c
        JOIN responsables_centro x ON x.centro_id = c.id
        WHERE c.tipo_registro = 'MAPA' AND c.fuente = 'CENTRO_ATENCION' AND c.fuente_id BETWEEN 1 AND 19
        UNION ALL
        SELECT 1
        FROM centros c
        JOIN redes_centro x ON x.centro_id = c.id
        WHERE c.tipo_registro = 'MAPA' AND c.fuente = 'CENTRO_ATENCION' AND c.fuente_id BETWEEN 1 AND 19
        UNION ALL
        SELECT 1
        FROM centros c
        JOIN requisitos_centro x ON x.centro_id = c.id
        WHERE c.tipo_registro = 'MAPA' AND c.fuente = 'CENTRO_ATENCION' AND c.fuente_id BETWEEN 1 AND 19
    ) THEN
        RAISE EXCEPTION 'Los centros de prueba tienen datos relacionados. Revise esos datos antes de eliminarlos.';
    END IF;

    UPDATE centros c
    SET organismo = s.organismo,
        tipo_organismo = s.tipo_organismo,
        descripcion = s.descripcion,
        direccion = s.direccion,
        estado_id = s.estado_id,
        municipio_id = s.municipio_id,
        parroquia_id = NULL,
        latitud = s.latitud,
        longitud = s.longitud
    FROM directorios_suministrados s
    WHERE c.fuente = 'DIRECTORIO'
      AND c.tipo_registro = 'DIRECTORIO'
      AND c.fuente_id = s.fuente_id;

    GET DIAGNOSTICS total_actualizados = ROW_COUNT;
    IF total_actualizados <> 133 THEN
        RAISE EXCEPTION 'Se actualizaron % directorios; se esperaban 133. Se revierte la transaccion.', total_actualizados;
    END IF;

    DELETE FROM centros
    WHERE tipo_registro = 'MAPA'
      AND fuente = 'CENTRO_ATENCION'
      AND fuente_id BETWEEN 1 AND 19;

    IF EXISTS (
        SELECT 1
        FROM centros
        WHERE tipo_registro = 'MAPA'
          AND fuente = 'CENTRO_ATENCION'
          AND fuente_id BETWEEN 1 AND 19
    ) THEN
        RAISE EXCEPTION 'No se pudieron eliminar todos los centros de prueba.';
    END IF;
END;
$$;

-- Resumen posterior: cantidad de registros enriquecidos y sedes agrupables.
SELECT
    count(*) AS directorios_georreferenciados,
    (
        SELECT count(*)
        FROM (
            SELECT DISTINCT municipio_id, latitud, longitud, lower(btrim(direccion))
            FROM centros
            WHERE tipo_registro = 'DIRECTORIO'
              AND fuente = 'DIRECTORIO'
              AND latitud IS NOT NULL
              AND longitud IS NOT NULL
        ) sedes
    ) AS sedes_fisicas_aproximadas
FROM centros
WHERE tipo_registro = 'DIRECTORIO'
  AND fuente = 'DIRECTORIO'
  AND fuente_id BETWEEN 1 AND 133
  AND latitud IS NOT NULL
  AND longitud IS NOT NULL;

COMMIT;
