 -- PROCEDIMIENTOS ALMACENADOS
DELIMITER $$

-- PROCEDIMIENTO QUE DEVUELVE LOS DATOS DE LAS MASCOTAS DATO EL ID DEL CLIENTE
DROP PROCEDURE IF EXISTS usuario_mascotas_verdetalle;
CREATE PROCEDURE usuario_mascotas_verdetalle(IN clienteID INT)
BEGIN
    SELECT idmascota, nombre_mascota, fecha_nacimiento, especie, raza, peso, color, sexo, obs
    FROM mascota m
    WHERE m.clienteid = clienteID;
END$$

-- PROCEDIMIENTO QUE DEVUELVE LOS DATOS DE LAS MASCOTAS DATO EL ID DE LA MASCOTA
DELIMITER $$
DROP PROCEDURE IF EXISTS usuario_mascotas_verdetalle;
CREATE PROCEDURE usuario_mascotas_verdetalle(IN mascotaID INT)
BEGIN
    SELECT *
    FROM mascota m
    WHERE m.idmascota = mascotaID;
END$$

-- Obtener los datosd el cliente dado el id de la mascota
DELIMITER $$
DROP PROCEDURE IF EXISTS mascota_cliente_verdetalle;
CREATE PROCEDURE mascota_cliente_verdetalle(IN mascotaID INT)
BEGIN
    SELECT c.idcliente, c.nombre_cliente, c.apellido, c.telefono, c.direccion, c.dni
    FROM cliente c
    JOIN mascota m ON c.idcliente = m.clienteid
    WHERE m.idmascota = mascotaID;
END$$



-- PROCEDIMIENTO QUE DEVUELVE EL ID DEL CLIENTE DADO EL CORREO DEL USER
DELIMITER $$
DROP PROCEDURE IF EXISTS obtener_idUsuarioXCorreo;
CREATE PROCEDURE obtener_idUsuarioXCorreo(IN userEmail VARCHAR(100))
BEGIN
SELECT c.idcliente
    FROM usuario u
    JOIN conexion cx ON u.idusuario = cx.usuarioid
    JOIN cliente c ON cx.idcliente = c.idcliente
    WHERE u.email = userEmail;
END $$


-- Nuevos procedimientos obtener info del usuario por correo
DELIMITER $$
CREATE PROCEDURE obtener_info_usuario_por_correo(IN user_email VARCHAR(255))
BEGIN
    SELECT 
        u.username AS Nombre_Usuario,
        u.email AS Email,
        u.contrasena AS Contrasena,
        CONCAT(c.nombre_cliente, ' ', c.apellido) AS Nombre_Completo,
        c.telefono AS Telefono,
        c.direccion AS Direccion
    FROM 
        usuario u
    INNER JOIN
        conexion cx ON u.idusuario = cx.usuarioid
    INNER JOIN
        cliente c ON cx.idcliente = c.idcliente
    WHERE 
        u.email = user_email;
END $$

DELIMITER $$
CREATE PROCEDURE editar_usuario(
	IN p_email VARCHAR(100),
    IN p_nombre_usuario VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_contrasena VARCHAR(255),
    IN p_direccion VARCHAR(200))
BEGIN
UPDATE usuario
    SET 
        username = p_nombre_usuario,
        contrasena = p_contrasena
    WHERE email = p_email;

    -- Actualizar la tabla cliente
    UPDATE cliente c
    JOIN conexion con ON c.idcliente = con.idcliente
    JOIN usuario u ON con.usuarioid = u.idusuario
    SET 
        c.telefono = p_telefono,
        c.direccion = p_direccion
    WHERE u.email = p_email;
END $$

DELIMITER $$
CREATE PROCEDURE buscar_nombres_cliente_barra(
	in texto_input VARCHAR(100)
)
BEGIN
	SELECT 
		idcliente,
		concat(nombre_cliente, ' ', apellido) as NombreCompleto
    FROM 
		cliente
    WHERE
		concat(nombre_cliente, ' ', apellido)  like CONCAT('%', texto_input, '%');
END $$

-- Crear nuevo cliente
DELIMITER $$
CREATE PROCEDURE CREAR_CLIENTE(
		IN p_nombre VARCHAR(100),
        IN p_apellidos VARCHAR(100),
        IN p_telefono VARCHAR(100)
)
BEGIN
	INSERT INTO cliente(nombre_cliente, apellido, telefono) VALUES(p_nombre, p_apellidos, p_telefono);
    SELECT LAST_INSERT_ID() AS id_cliente;
END $$

-- Crear nueva mascota
DELIMITER $$
DROP PROCEDURE IF EXISTS CREAR_MASCOTA $$
CREATE PROCEDURE CREAR_MASCOTA(
		IN p_nombre VARCHAR(100),
        IN p_especie VARCHAR(100),
        IN p_raza VARCHAR(100),
        IN p_sexo VARCHAR(100),
        IN p_idcliente int
)
BEGIN
	INSERT INTO mascota(nombre_mascota, especie, raza, sexo, clienteid)
    VALUES(p_nombre, p_especie, p_raza, p_sexo, p_idcliente);
    SELECT LAST_INSERT_ID() AS idmascota;
END $$

-- Crear nuevo SESION dado el id
DELIMITER $$
CREATE PROCEDURE crear_sesion(
    IN p_idmascota INT,
	IN p_monto FLOAT,
	IN p_masinfo TEXT,
	IN p_fecha DATE
)
BEGIN
	INSERT INTO sesion(fecha, hora, monto, idmascota, masInfo)
    values(p_fecha, NULL, p_monto, p_idmascota, p_masinfo);
    SELECT LAST_INSERT_ID() AS id_sesion;
END $$

-- Crear nuevo servicio dado el id
DELIMITER $$
CREATE PROCEDURE crear_servicio(
	in idsesion int,
    in p_nombreservicio varchar(50)
)
BEGIN
	INSERT INTO servicio(NombreServicio, idsesion)values(p_nombreservicio, idsesion);
END $$

-- OBTENER ID DEL HISTORIAL MEDICO DADO EL ID DE LA MASCOTA
DELIMITER $$
CREATE PROCEDURE get_idmas_by_idhis(
	IN p_idmascota INT
)
BEGIN
	SELECT idHistorialMedico FROM historialmedico WHERE p_idmascota = idmascota;
END $$

-- Obtener las vacunas dadas el historial Medico
DELIMITER $$
CREATE PROCEDURE get_by_id_vac(
IN p_idHistorialMedico INT
)
BEGIN
	SELECT 
		fecha, tipoVacunacion, temperatura, peso 
    FROM 
		vacuna 
	WHERE 
		idHistorialMedico = p_idHistorialMedico;
END $$

-- Obtener la revisionMedica Dada el id dEL HISTORIAL
DELIMITER $$
CREATE PROCEDURE get_by_id_revmed(
	IN p3_idHistorialMedico INT
)
BEGIN
	SELECT
		fecha,
		temperatura,
		frecuenciaCardiaca,
		frecuenciaRespiratoria,
		peso,
		mucosas ,
		glucosa,
		TLC,
		anamesis,
		diagnosticoPresuntivo,
		tratamiento,
		receta
	FROM
		revisionmedica
    WHERE
		idHistorialMedico = p3_idHistorialMedico;
END $$

-- OBTENER LOS DATOS DE DESAPARICITACION DADO EL HISTORIAL MEDICO
DELIMITER $$
CREATE DEFINER=root@localhost PROCEDURE get_by_id_despara(
	IN p2_idHistorialMedico INT
)
BEGIN
	SELECT
		fecha, producto, peso
	FROM
		desparasitacion
    WHERE
		idHistorialMedico = p2_idHistorialMedico;
END $$

DELIMITER ;


