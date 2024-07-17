/*Clientes*/
DELIMITER $$
CREATE TRIGGER after_cliente_insert
AFTER INSERT ON cliente
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('cliente', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_cliente_update
AFTER UPDATE ON cliente
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('cliente', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_cliente_delete
AFTER DELETE ON cliente
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('cliente', 'DELETE');
END$$
DELIMITER ;




/*mascota*/
DELIMITER $$
CREATE TRIGGER after_mascota_insert
AFTER INSERT ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_mascota_update
AFTER UPDATE ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_mascota_delete
AFTER DELETE ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'DELETE');
END$$
DELIMITER ;



/*usuario*/
DELIMITER $$
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('usuario', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_usuario_update
AFTER UPDATE ON usuario
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('usuario', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_usuario_delete
AFTER DELETE ON usuario
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('usuario', 'DELETE');
END$$
DELIMITER ;



/*mascota*/
DELIMITER $$
CREATE TRIGGER after_mascota_insert
AFTER INSERT ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_mascota_update
AFTER UPDATE ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_mascota_delete
AFTER DELETE ON mascota
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('mascota', 'DELETE');
END$$
DELIMITER ;









/*HistorialMedico*/
DELIMITER $$
CREATE TRIGGER after_HistorialMedico_insert
AFTER INSERT ON HistorialMedico
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('HistorialMedico', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_HistorialMedico_update
AFTER UPDATE ON HistorialMedico
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('HistorialMedico', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_HistorialMedico_delete
AFTER DELETE ON HistorialMedico
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('HistorialMedico', 'DELETE');
END$$
DELIMITER ;




/*Vacuna*/
DELIMITER $$
CREATE TRIGGER after_Vacuna_insert
AFTER INSERT ON Vacuna
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Vacuna', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Vacuna_update
AFTER UPDATE ON Vacuna
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Vacuna', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Vacuna_delete
AFTER DELETE ON Vacuna
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Vacuna', 'DELETE');
END$$
DELIMITER ;















/*Desparasitacion*/
DELIMITER $$
CREATE TRIGGER after_Desparasitacion_insert
AFTER INSERT ON Desparasitacion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Desparasitacion', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Desparasitacion_update
AFTER UPDATE ON Desparasitacion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Desparasitacion', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Desparasitacion_delete
AFTER DELETE ON Desparasitacion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Desparasitacion', 'DELETE');
END$$
DELIMITER ;














/*RevisionMedica*/
DELIMITER $$
CREATE TRIGGER after_RevisionMedica_insert
AFTER INSERT ON RevisionMedica
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('RevisionMedica', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_RevisionMedica_update
AFTER UPDATE ON RevisionMedica
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('RevisionMedica', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_RevisionMedica_delete
AFTER DELETE ON RevisionMedica
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('RevisionMedica', 'DELETE');
END$$
DELIMITER ;












/*Sesion*/
DELIMITER $$
CREATE TRIGGER after_Sesion_insert
AFTER INSERT ON Sesion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Sesion', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Sesion_update
AFTER UPDATE ON Sesion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Sesion', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_Sesion_delete
AFTER DELETE ON Sesion
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('Sesion', 'DELETE');
END$$
DELIMITER ;






/*servicio*/
DELIMITER $$
CREATE TRIGGER after_servicio_insert
AFTER INSERT ON servicio
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('servicio', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_servicio_update
AFTER UPDATE ON servicio
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('servicio', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_servicio_delete
AFTER DELETE ON servicio
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('servicio', 'DELETE');
END$$
DELIMITER ;









/*categoria*/
DELIMITER $$
CREATE TRIGGER after_categoria_insert
AFTER INSERT ON categoria
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('categoria', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_categoria_update
AFTER UPDATE ON categoria
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('categoria', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_categoria_delete
AFTER DELETE ON categoria
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('categoria', 'DELETE');
END$$
DELIMITER ;











/*productos*/
DELIMITER $$
CREATE TRIGGER after_productos_insert
AFTER INSERT ON productos
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('productos', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_productos_update
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('productos', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_productos_delete
AFTER DELETE ON productos
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('productos', 'DELETE');
END$$
DELIMITER ;














/*compra*/
DELIMITER $$
CREATE TRIGGER after_compra_insert
AFTER INSERT ON compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('compra', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_compra_update
AFTER UPDATE ON compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('compra', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_compra_delete
AFTER DELETE ON compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('compra', 'DELETE');
END$$
DELIMITER ;















/*detalle_compra*/
DELIMITER $$
CREATE TRIGGER after_detalle_compra_insert
AFTER INSERT ON detalle_compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('detalle_compra', 'INSERT');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_detalle_compra_update
AFTER UPDATE ON detalle_compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('detalle_compra', 'UPDATE');
END$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER after_detalle_compra_delete
AFTER DELETE ON detalle_compra
FOR EACH ROW
BEGIN
    INSERT INTO registros (tabla, operacion)
    VALUES ('detalle_compra', 'DELETE');
END$$
DELIMITER ;