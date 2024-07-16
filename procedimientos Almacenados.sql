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
DROP PROCEDURE IF EXISTS mascotas_verdetalle;
CREATE PROCEDURE mascotas_verdetalle(IN mascotaID INT)
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

-- ACTUALIZAR MASCOTA
DELIMITER $$
CREATE PROCEDURE update_mascota_histmed(
	IN p_idmascota INT,
	IN p_nombre_mascota VARCHAR(100),
    IN p_especie VARCHAR(100),
    IN p_raza VARCHAR(100),
    IN p_color VARCHAR(50),
    IN p_sexo VARCHAR(10),
    IN p_obs TEXT,
    IN p_fecha_nacimiento DATE
)
BEGIN
	UPDATE mascota
    SET 
		nombre_mascota = IF(p_nombre_mascota = '', nombre_mascota, p_nombre_mascota), 
        especie = IF(p_especie = '', especie, p_especie), 
        raza = IF(p_raza = '', raza, p_raza),
        color = IF(p_color = '', color, p_color),
        sexo = IF(p_sexo = '', sexo, p_sexo),
        obs = IF(p_obs = '', obs, p_obs),
        fecha_nacimiento = IFNULL(p_fecha_nacimiento, fecha_nacimiento)
	WHERE 
		p_idmascota = idmascota;
END $$

-- ACTUALIZAR CLIENTE
DELIMITER $$
CREATE PROCEDURE update_cliente_histmed(
	IN p_idcliente INT,
    IN p_nombre_cliente VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_direccion VARCHAR(100),
    IN p_telefono VARCHAR(20)
)
BEGIN
	UPDATE cliente
    SET 
		nombre_cliente = IF(p_nombre_cliente = '', nombre_cliente, p_nombre_cliente),
        apellido = IF(p_apellido = '', apellido, p_apellido),
        direccion = IF(p_direccion = '', direccion, p_direccion),
        telefono = IF(p_telefono = '', telefono, p_telefono)
    WHERE
        idcliente = p_idcliente;
END $$


-- CREAR VACUNAS
DELIMITER $$
CREATE  PROCEDURE post_by_id_vac(
	IN p_idHistorialMedico INT,
    IN p_fecha DATE,
    IN p_tipoVacunacion VARCHAR(50),
    IN p_temperatura decimal(5,2),
    IN p_peso decimal(5,3)
)
BEGIN
	INSERT INTO vacuna(idHistorialMedico, fecha, tipoVacunacion, temperatura, peso)
    VALUES(
		IFNULL(p_idHistorialMedico, NULL),
        IFNULL(p_fecha, NULL),
        IFNULL(p_tipoVacunacion, NULL),
        IFNULL(p_temperatura, NULL),
        IFNULL(p_peso, NULL)
	);
END $$

-- CREAR DESPARACITACION
DELIMITER $$
CREATE PROCEDURE post_by_id_despara(
	IN p_idHistorialMedico INT,
    IN p_fecha DATE,
    IN p_produto VARCHAR(100),
    IN p_peso DECIMAL(5,3)
)
BEGIN
	INSERT INTO desparasitacion(idHistorialMedico, fecha, producto, peso)
    VALUES(
		IFNULL(p_idHistorialMedico, NULL),
        IFNULL(p_fecha, NULL),
        IFNULL(p_produto, NULL),
        IFNULL(p_peso, NULL)
	);
END $$

-- Crear historia Medica
DELIMITER $$
CREATE PROCEDURE post_by_id_revmed(
    IN p_idHistorialMedico INT,
    IN p_fecha DATE,
    IN p_temperatura DECIMAL(5,2),
    IN p_frecuenciaCardiaca INT,
    IN p_frecuenciaRespiratoria INT,
    IN p_peso DECIMAL(5,2),
    IN p_mucosas VARCHAR(50),
    IN p_glucosa DECIMAL(5,2),
    IN p_TLC DECIMAL(5,2),
    IN p_anamesis TEXT,
    IN p_diagnosticoPresuntivo TEXT,
    IN p_tratamiento TEXT,
    IN p_receta TEXT
)
BEGIN
    INSERT INTO revisionmedica (idHistorialMedico, fecha, temperatura, frecuenciaCardiaca, frecuenciaRespiratoria, peso, mucosas, glucosa, TLC, anamesis, diagnosticoPresuntivo, tratamiento, receta)
    VALUES (
        IFNULL(p_idHistorialMedico, NULL),
        IFNULL(p_fecha, NULL),
        IFNULL(p_temperatura, NULL),
        IFNULL(p_frecuenciaCardiaca, NULL),
        IFNULL(p_frecuenciaRespiratoria, NULL),
        IFNULL(p_peso, NULL),
        IFNULL(p_mucosas, NULL),
        IFNULL(p_glucosa, NULL),
        IFNULL(p_TLC, NULL),
        IFNULL(p_anamesis, NULL),
        IFNULL(p_diagnosticoPresuntivo, NULL),
        IFNULL(p_tratamiento, NULL),
        IFNULL(p_receta, NULL)
    );
END $$


DELIMITER ;


