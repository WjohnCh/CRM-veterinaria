 -- PROCEDIMIENTOS ALMACENADOS
DELIMITER $$

-- PROCEDIMIENTO QUE DEVUELVE LOS DATOS DE LAS MASCOTAS DATO EL ID DEL CLIENTE
DROP PROCEDURE IF EXISTS usuario_mascotas_verdetalle;

CREATE PROCEDURE usuario_mascotas_verdetalle(IN clienteID INT)
BEGIN
    SELECT idmascota, nombre_mascota, fecha_nacimiento, especie, raza, peso, color, sexo
    FROM mascota m
    WHERE m.clienteid = clienteID;
END$$

-- PROCEDIMIENTO QUE DEVUELVE ELID DEL CLIENTE DADO EL CORREO DEL USER
DROP PROCEDURE IF EXISTS obtener_idUsuarioXCorreo;
CREATE PROCEDURE obtener_idUsuarioXCorreo(IN userEmail VARCHAR(100))
BEGIN
    SELECT c.idcliente
    FROM cliente c
    JOIN usuario u ON c.usuarioid = u.idusuario
    WHERE u.email = userEmail;
END $$

DELIMITER ;