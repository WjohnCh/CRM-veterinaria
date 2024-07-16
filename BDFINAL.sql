drop database if exists crm_oficial2;
create database crm_oficial2;
use crm_oficial2;
CREATE TABLE IF NOT EXISTS usuario (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) ,
    email VARCHAR(100),
    contrasena VARCHAR(255),
    rol VARCHAR(45) 
);
CREATE TABLE IF NOT EXISTS cliente (
     idcliente int AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) ,
	apellido VARCHAR(100) ,
	telefono varchar(20),
	direccion VARCHAR(100),
    dni VARCHAR(100),
    PRIMARY KEY (idcliente)
);

CREATE TABLE IF NOT EXISTS conexion (
	idConexion int AUTO_INCREMENT,
    usuarioid INT,
	idcliente INT,
    PRIMARY KEY (idConexion),
    FOREIGN KEY (usuarioid) REFERENCES usuario(idusuario),
    FOREIGN KEY (idcliente) REFERENCES cliente(idcliente)
);

CREATE TABLE IF NOT EXISTS mascota (
    idmascota INT(11) AUTO_INCREMENT,
    nombre_mascota VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    especie VARCHAR(100) NOT NULL,
    raza VARCHAR(100),
    peso DECIMAL(5,2) NULL,
    color VARCHAR(50) ,
    sexo VARCHAR(10) NOT NULL,
    clienteid INT,
    PRIMARY KEY (idmascota),
    FOREIGN KEY (clienteid) REFERENCES cliente (idcliente)
);

CREATE TABLE IF NOT EXISTS HistorialMedico (
    idHistorialMedico INT AUTO_INCREMENT PRIMARY KEY,
    idmascota INT,
    FOREIGN KEY (idmascota) REFERENCES mascota(idmascota)
);


CREATE TABLE IF NOT EXISTS Vacuna (
    idVacuna INT AUTO_INCREMENT PRIMARY KEY,
    idHistorialMedico INT,
    fecha DATE,
    tipoVacunacion VARCHAR(50),
    temperatura DECIMAL(5,2),
    peso DECIMAL(5,3),
    FOREIGN KEY (idHistorialMedico) REFERENCES HistorialMedico(idHistorialMedico)
);

CREATE TABLE IF NOT EXISTS Desparasitacion (
    idDesparasitacion INT AUTO_INCREMENT PRIMARY KEY,
    idHistorialMedico INT,
    fecha DATE,
    producto VARCHAR(100),
    peso DECIMAL(5,3),
    FOREIGN KEY (idHistorialMedico) REFERENCES HistorialMedico(idHistorialMedico)
);

CREATE TABLE IF NOT EXISTS RevisionMedica (
    idRevisionMedica INT AUTO_INCREMENT PRIMARY KEY,
    idHistorialMedico INT,
    fecha DATE,
    temperatura DECIMAL(5,2),
    frecuenciaCardiaca INT,
    frecuenciaRespiratoria INT,
    peso DECIMAL(5,2),
    mucosas VARCHAR(50),
    glucosa DECIMAL(5,2),
    TLC DECIMAL(5,2),
    anamesis TEXT,
    diagnosticoPresuntivo TEXT,
    tratamiento TEXT,
    receta TEXT,
    FOREIGN KEY (idHistorialMedico) REFERENCES HistorialMedico(idHistorialMedico)
);

CREATE TABLE IF NOT EXISTS Sesion (
    idSesion INT(11) AUTO_INCREMENT,
    fecha DATE,
    hora time,
    monto FLOAT,
    idmascota INT,
    masInfo TEXT,
    PRIMARY KEY (idSesion),
    FOREIGN KEY (idmascota) REFERENCES mascota (idmascota)
);

CREATE TABLE IF NOT EXISTS servicio(
	idServicio INT AUTO_INCREMENT PRIMARY KEY,
    NombreServicio varchar(50),
    idSesion int,
	FOREIGN KEY (idSesion) REFERENCES Sesion (idSesion)
);

CREATE TABLE IF NOT EXISTS categoria (
	idCategoria int(11) auto_increment primary key,
    nombre varchar(100)
);

INSERT INTO categoria (nombre) VALUES
("Alimentos"), -- seco, humedo, suplementos, premios.
("Accesorios y equipamento"), -- ropa, camas, mantas, juguetes, collares, correas, bebederos 
("Transportes y dormitorios"), -- transportadoras, bolsas de deporte, cinturones de seguridad
("Higiene y limpieza"); -- Champus, cepillos, peines, cortaunas, tijeras, panitos


CREATE TABLE IF NOT EXISTS productos (
    idproductos INT(11) AUTO_INCREMENT,
    nombre VARCHAR(100),
    precio FLOAT,
    razaMascota varchar (50),
    url varchar(200),
    idCategoria int,
    is_visible BOOLEAN DEFAULT TRUE,
    descripcion varchar(500),
    PRIMARY KEY (idproductos),
    FOREIGN KEY (idCategoria) REFERENCES categoria (idCategoria)
);

CREATE TABLE IF NOT EXISTS compra (
    idcompra INT(11) AUTO_INCREMENT,
    fecha DATE,
    total FLOAT ,
    clienteid INT,
	distrito varchar(50),
    CalleDireccion varchar(200),
    comentarios varchar(400),
    metododePago varchar(20),
    tipoEnvio varchar(30),
    telefonoEnvio varchar(20),
    isCancelled BOOLEAN DEFAULT FALSE,
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

INSERT INTO productos (nombre, precio, razaMascota, url, descripcion, idCategoria) VALUES
('Comida Purina', 15.50, 'gato', './src/uploads/comida-purina-gato.jpg', 'Nutritiva comida Purina para gatos, ideal para una dieta balanceada y saludable.', 1),
('Lata Tuna & Shrimp', 12.00, 'gato', './src/uploads/lata-tuna&shrimp-gato.jpg', 'Deliciosa lata de atún y camarones para gatos, rica en proteínas.', 1),
('Whiskas', 13.75, 'gato', './src/uploads/whiskas-gato.jpg', 'Comida Whiskas, especialmente formulada para una nutrición completa.', 1),
('Whiskas 1kg Bolsa', 20.00, 'gato', './src/uploads/whiskas-1kg-bolsa-gatos.jpg', 'Bolsa de 1kg de Whiskas, ideal para todas las etapas de vida.', 1),
('Lata Chicken & Duck', 14.00, 'gato', './src/uploads/lata-chicken&duck-gato.jpg', 'Sabrosa lata de pollo y pato, rica en proteínas para gatos.', 1),

('Rascador', 25.00, 'gato', './src/uploads/rascador-gato.jpg', 'Rascador para gatos, perfecto para mantener sus uñas saludables.', 2),
('Gimnasio', 45.00, 'gato', './src/uploads/gimnasio-gato.jpg', 'Gimnasio para gatos, ideal para ejercicio y entretenimiento.', 2),
('Túnel', 20.00, 'gato', './src/uploads/tunelgatos.png', 'Divertido túnel para gatos, perfecto para jugar y esconderse.', 2),
('Juguete Pescado', 12.50, 'gato', './src/uploads/juguete-pescado-gato.jpg', 'Juguete con forma de pescado, atractivo y divertido para gatos.', 2),
('Chaleco', 25.50, 'gato', './src/uploads/chaleco-gato.jpg', 'Chaleco para gatos, cómodo y ajustable.', 2),
('Disfraz Dino', 27.00, 'gato', './src/uploads/disfraz-dino-gato.jpg', 'Disfraz de dinosaurio, divertido y único para gatos.', 2),
('Ropa Lujosa', 30.00, 'gato', './src/uploads/ropa-lujosa-gato.jpg', 'Ropa lujosa para gatos, elegante y cómoda.', 2),
('Disfraz Halloween', 26.00, 'gato', './src/uploads/disfraz-gato-halloween.jpg', 'Disfraz de Halloween para gatos, espeluznante y divertido.', 2),
('Disfraz Capitán América', 28.00, 'gato', './src/uploads/disfraz-capitaamerica-gato.jpg', 'Disfraz de Capitán América, perfecto para gatos valientes.', 2),

('Maletín Avión', 40.00, 'gato', './src/uploads/maletin-avion-gato.jpeg', 'Maletín de avión, perfecto para transportar a tu gato con seguridad.', 3),
('Cama Cueva', 30.00, 'gato', './src/uploads/cama-gato-cueva.jpg', 'Cama en forma de cueva, acogedora y perfecta para gatos.', 3),
('Cama Hamaca', 32.50, 'gato', './src/uploads/cama-hamaca-gato.jpg', 'Cama hamaca, ideal para que tu gato descanse cómodamente.', 3),
('Hamaca Mecedora', 35.50, 'gato', './src/uploads/hamaca-mecedora-gato.jpg', 'Hamaca mecedora, perfecta para el descanso de tu gato.', 3),

('Comida Pedigree', 22.50, 'perro', './src/uploads/comida-pedigree-perro.jpg', 'Deliciosa comida Pedigree, formulada para mantener a tu mascota saludable y feliz.', 1),
('Dogshow Comida', 18.25, 'perro', './src/uploads/dogshow-comida-perro.jpg', 'Comida Dogshow, nutritiva y sabrosa.', 1),
('Comida Premio Hueso', 10.50, 'perro', './src/uploads/comida-premio-hueso-perro.jpg', 'Premio en forma de hueso, ideal para recompensar a tu perro.', 1),
('Snack Fit', 8.75, 'perro', './src/uploads/snack-fit-comida-perro.jpg', 'Delicioso snack Fit, perfecto para mantener a tu perro activo y saludable.', 1),

('Escalera Plegable', 30.00, 'perro', './src/uploads/escalera-plegable-perro.jpg', 'Escalera plegable, ideal para ayudar a tu perro a alcanzar lugares altos.', 2),
('Pelota Sonrisa', 10.00, 'perro', './src/uploads/pelota-sonrisa-perro.jpg', 'Pelota con diseño de sonrisa, ideal para juegos interactivos con tu perro.', 2),
('Ropa Sapo', 18.75, 'perro', './src/uploads/ropa-sapo-perro.jpg', 'Ropa con diseño de sapo, divertida y cómoda para perros.', 2),
('Ropa Pequeña', 17.50, 'perro', './src/uploads/ropa-pequena-perro.jpg', 'Ropa pequeña, perfecta para perros de razas pequeñas.', 2),
('Disfraz Superman', 25.00, 'perro', './src/uploads/disfraz-superman-perro.jpg', 'Disfraz de Superman, ideal para fiestas y eventos.', 2),
('Disfraz Taco', 23.50, 'perro', './src/uploads/disfraz-taco-perro.jpg', 'Divertido disfraz de taco, perfecto para tu perro.', 2),
('Collar LED', 15.00, 'perro', './src/uploads/collar-led-perro.jpg', 'Collar LED, ideal para paseos nocturnos con tu perro.', 2),
('Comedero Pequeño', 12.00, 'perro', './src/uploads/comedero-para-perros-peque-os-medidas.jpg', 'Comedero pequeño, adecuado para perros de razas pequeñas.', 2),
('Arnés', 20.00, 'perro', './src/uploads/arnes-para-perro.png', 'Arnés cómodo y seguro para perros.', 3),

('Mochila Espacial', 50.00, 'todos', './src/uploads/mochila-espacial-transparente-todos.jpg', 'Mochila espacial transparente, ideal para transportar a tu mascota con estilo.', 2),
('Vestido', 22.00, 'todos', './src/uploads/vestido-perro-gato.jpg', 'Vestido elegante, adecuado para perros y gatos.', 2),

('Corral para Mascotas', 35.00, 'todos', './src/uploads/corral-para-mascotas-todos.jpg', 'Corral para mascotas, ideal para mantener seguros a tus animales.', 3),
('Cama Donut', 28.00, 'todos', './src/uploads/cama-donut-cueva-todos.jpg', 'Cama en forma de donut, acogedora y cómoda para todas las mascotas.', 3),
('Corral Plástico', 45.00, 'todos', './src/uploads/m-corral-plastico-perro.jpg', 'Corral de plástico, ideal para mantener a tu perro seguro.', 3),
('Manta Impermeable', 22.50, 'todos', './src/uploads/manta-impermeable-todos.jpg', 'Manta impermeable, ideal para proteger los muebles de tus mascotas.', 3),
('Rampa Madera', 40.00, 'todos', './src/uploads/rampa-madera-mascotas-todos.jpeg', 'Rampa de madera, ideal para mascotas mayores o con problemas de movilidad.', 3),

('Cepillo Saca Pelusas', 10.00, 'todos', './src/uploads/cepillo-saca-pelusas-todos.jpg', 'Cepillo saca pelusas, ideal para mantener el pelaje de tu mascota limpio.', 4),
('Panitos Absorbentes', 8.00, 'todos', './src/uploads/panitos-absorbentes-todos.png', 'Panitos absorbentes, perfectos para la higiene de tu mascota.', 4),
('Mantel Antiderrames', 12.50, 'todos', './src/uploads/mantel-antiderrames-gatos.jpg', 'Mantel antiderrames, ideal para gatos desordenados.', 4),
('Toalla', 9.00, 'todos', './src/uploads/toalla-mascota-todos.jpg', 'Toalla para mascotas, suave y absorbente.', 4),
('Porta Rollo', 7.50, 'todos', './src/uploads/porta-rollo-tela-todos.jpg', 'Porta rollo de tela, práctico y útil para todas las mascotas.', 4),
('Bolsa Biodegradables', 5.00, 'todos', './src/uploads/bolsa-biodegradables-todos.jpeg', 'Bolsas biodegradables, ideales para recoger los desechos de tu mascota de manera ecológica.', 4),
('Dispensador de Bolsas', 6.50, 'todos', './src/uploads/dispensador-bolsa-todos.jpg', 'Dispensador de bolsas, práctico y fácil de usar durante los paseos.', 4);


INSERT INTO usuario (idusuario, username, email, contrasena, rol)
VALUES
(1, 'jdoe', 'jdoe@example.com', 'password123', 'user'),
(2, 'asmith', 'asmith@example.com', 'password456', 'user'),
(3, 'mjones', 'mjones@example.com', 'password789', 'user');

INSERT INTO cliente (idcliente, nombre_cliente, apellido, telefono, direccion, dni)
VALUES
(1, 'John', 'Doe', '5551234', '123 Elm St', '12345678'),
(2, 'Alice', 'Smith', '5555678', '456 Oak St', '23456789'),
(3, 'Michael', 'Jones', '5559012', '789 Pine St', '34567890');

INSERT INTO conexion (idConexion, usuarioid, idcliente)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

INSERT INTO mascota (clienteid, nombre_mascota, fecha_nacimiento, especie, raza, peso, color, sexo) VALUES
	(1, 'Bobby', '2020-05-15', 'Perro', 'Labrador', 30, 'Marrón', 'M'),
	(1, 'Whiskers', '2019-08-20', 'Gato', 'Siames', 4, 'Blanco', 'H'),
	(2, 'Dorado', '2020-05-15', 'Perro', 'Labrador', 30, 'Marrón', 'M'),
	(2, 'Selfish', '2019-08-20', 'Gato', 'Siames', 4, 'Blanco', 'H');


