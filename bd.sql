create database crm_oficial1;
use crm_oficial1;
CREATE TABLE IF NOT EXISTS usuario (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) ,
    apellido VARCHAR(100) ,
    email VARCHAR(100),
    direccion VARCHAR(100),
    dni VARCHAR(100) ,
    Fecha_Nacimiento DATE ,
    genero VARCHAR(15),
    contrasena VARCHAR(255),
    rol VARCHAR(45) 
);

CREATE TABLE IF NOT EXISTS cliente (
    idcliente INT(11) AUTO_INCREMENT,
    usuarioid INT(11),
    PRIMARY KEY (idcliente),
    FOREIGN KEY (usuarioid) REFERENCES usuario(idusuario)
);

CREATE TABLE IF NOT EXISTS veterinario (
    veterinarioid INT(11) AUTO_INCREMENT,
    usuario_idusuario INT(11),
    especializacion VARCHAR(45),
    PRIMARY KEY (veterinarioid),
    FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario)
);

CREATE TABLE IF NOT EXISTS mascota (
    idmascota INT(11) AUTO_INCREMENT,
    nombre_mascota VARCHAR(100),
    id_cliente INT(11),
    fecha_nacimiento DATE,
    especie VARCHAR(100),
    raza VARCHAR(100) ,
    peso DECIMAL(5,2),
    color VARCHAR(50),
    sexo VARCHAR(10),
    clienteid INT,
    PRIMARY KEY (idmascota),
    FOREIGN KEY (clienteid) REFERENCES cliente (idcliente)
);

CREATE TABLE IF NOT EXISTS historial_medico (
    idhistorial_medico INT AUTO_INCREMENT,
    otros VARCHAR(45) NULL,
    mascota_idmascota INT(11),
    PRIMARY KEY (idhistorial_medico, mascota_idmascota),
    FOREIGN KEY (mascota_idmascota) REFERENCES mascota (idmascota)
);

CREATE TABLE IF NOT EXISTS cita (
    idcita INT(11) AUTO_INCREMENT,
    fecha_hora DATETIME ,
    veterinariaid INT(11),
    estadocita VARCHAR(45),
    monto FLOAT,
    clienteid INT ,
    modalidad_pago VARCHAR(45) NULL,
    mascota_idmascota INT(11),
    PRIMARY KEY (idcita),
    FOREIGN KEY (veterinariaid) REFERENCES veterinario (veterinarioid),
    FOREIGN KEY (clienteid) REFERENCES cliente (idcliente),
    FOREIGN KEY (mascota_idmascota) REFERENCES mascota (idmascota)
);

CREATE TABLE IF NOT EXISTS productos (
    idproductos INT(11) AUTO_INCREMENT,
    nombre VARCHAR(100),
    precio FLOAT,
    mascota varchar (50),
    url varchar(200),
    PRIMARY KEY (idproductos)
);

CREATE TABLE IF NOT EXISTS categoria (
	idCategoria int(11) auto_increment,
    nombre varchar(100)
);  

CREATE TABLE IF NOT EXISTS compra (
    idcompra INT(11) AUTO_INCREMENT,
    fecha DATE,
    total FLOAT ,
    clienteid INT,
    PRIMARY KEY (idcompra),
    FOREIGN KEY (clienteid) REFERENCES cliente (idcliente)
);

CREATE TABLE IF NOT EXISTS detalle_compra (
    idd_compra INT(11) AUTO_INCREMENT,
    ventaid INT(11),
    productosid INT(11),
    precio_instante FLOAT,
    cantidad INT,
    PRIMARY KEY (idd_compra),
    FOREIGN KEY (productosid) REFERENCES productos (idproductos),
    FOREIGN KEY (ventaid) REFERENCES compra (idcompra)
);

CREATE TABLE IF NOT EXISTS registros (
    registrosid INT(11) AUTO_INCREMENT,
    tabla VARCHAR(100),
    operacion VARCHAR(10),
    usuarioid INT(11),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (registrosid)
);

CREATE TABLE IF NOT EXISTS Administrador (
    idAdministrador INT AUTO_INCREMENT,
    usuarioid INT,
    PRIMARY KEY (idAdministrador),
    FOREIGN KEY (usuarioid) REFERENCES usuario (idusuario)
);

CREATE TABLE IF NOT EXISTS asunto (
    idasunto INT AUTO_INCREMENT,
    nombre VARCHAR(45),
    descripcion VARCHAR(45),
    cita_idcita INT(11),
    PRIMARY KEY (idasunto, cita_idcita),
    FOREIGN KEY (cita_idcita) REFERENCES cita (idcita)
);