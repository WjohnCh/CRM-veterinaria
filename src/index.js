const sequelize = require('./libs/conexionMsql')
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const port = process.env.PORT || 3000;

const { idUserByCorreo, calcularTotal, anidadirDetalle, DetallePedidos, detallPedidoProducto
    , detallPedidoCancelado, existeEmail, ArrayMascotas, crearMascota, editarMascota, obtenerInfoUsuarioPorCorreo
    , editarDatosUsuario, obtenerSesiones, obtenerClientes, obtenerMascotas,
    obtenerHistorialMedico, obtenerUsuarios, actualizahistorialMedico
    , VacunasMascota, DesparacitacionMascota
} = require('./indexUsuario.js')


const fs = require('node:fs');

const multer = require('multer');
const { log } = require('console');
const upload = multer({ dest: './src/uploads/' });

const SECRET_KEY = 'crm_vet_2024'; // CLAVE SECRETA SE CAMBIARÁ CUANDO SE LANZE A PRODUCCIÓN

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.query.accesstoken;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Token error:', err);
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
};

const verifyCorreo = async (req, res, next) => {
    const { Distrito, CalleDireccion, comentarioAdicional = '-',
        correo, nombre, apellido, telefono, dni,
        MetodoPago, productosGuardados } = req.body;

    const totalPrecio = await calcularTotal(productosGuardados);
    try {
        const idUsuario = await idUserByCorreo(correo);
        //si el correo existe, le aniadimos el producto al cliente
        if (idUsuario) {
            const [results] = await sequelize.query('SELECT idcliente FROM cliente WHERE usuarioid  = ?',
                {
                    replacements: [idUsuario]
                }
            )
            if (Distrito && CalleDireccion) {
                const [result2] = await sequelize.query(
                    `INSERT INTO compra (fecha,  clienteid, total, distrito, CalleDireccion, comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                     VALUES (CURDATE(),?, ?, ?, ?, ?, ?,?, 'Domicilio')`,
                    {
                        replacements: [results[0].idcliente, totalPrecio, Distrito, CalleDireccion, comentarioAdicional, MetodoPago, telefono]
                    }
                )
                await anidadirDetalle(result2, productosGuardados);

            } else {
                const [result2] = await sequelize.query(
                    `INSERT INTO compra (fecha,  clienteid, total,  comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                     VALUES (CURDATE(), ?, ?, ?, ?, ?, 'Retiro Tienda')`,
                    {
                        replacements: [results[0].idcliente, totalPrecio, comentarioAdicional, MetodoPago, telefono]
                    }
                )
                await anidadirDetalle(result2, productosGuardados);
            }
            res.json(req.body)
        } else {
            //si el correo no existe, creamos un nuevo usuario
            next();
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
};

app.post('/images/single', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    const { nombre, precio, categoria, descripcion, mascota } = req.body;

    const newPath = `./src/uploads/${file.originalname}`
    try {
        fs.renameSync(file.path, newPath);

        await sequelize.query(
            `INSERT INTO productos (nombre, precio, razaMascota,  url, idCategoria, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            { replacements: [nombre, parseFloat(precio), mascota, newPath, parseInt(categoria), descripcion] }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al mover el archivo');
    }
})

app.put('/update/products/:id', upload.single('avatar'), async (req, res) => {
    const { id } = req.params
    const file = req.file;
    const { nombre, precio, categoria, descripcion, mascota } = req.body;

    let newPath;

    try {
        let query;
        if (file) {
            newPath = `./src/uploads/${file.originalname}`
            fs.renameSync(file.path, newPath);
            [query] = await sequelize.query(
                ` UPDATE productos SET 
                    nombre = ?, precio = ?, razaMascota = ?, url = ?, idCategoria = ?, descripcion = ?
                    WHERE idproductos = ?`,
                { replacements: [nombre, parseFloat(precio), mascota, newPath, parseInt(categoria), descripcion, parseInt(id)] }
            );
        } else {
            [query] = await sequelize.query(
                ` UPDATE productos SET 
                    nombre = ?, precio = ?, razaMascota = ?, idCategoria = ?, descripcion = ?
                    WHERE idproductos = ?`,
                { replacements: [nombre, parseFloat(precio), mascota, parseInt(categoria), descripcion, parseInt(id)] }
            );
        }
        res.json(query);
    } catch (error) {
        console.error("console.error('Error al actualizar el producto:', error);", error);
        res.status(500).send('Error al actualizar el producto');
    }
})




app.get('/', async (req, res) => {
    const [results] = await sequelize.query('SELECT * FROM productos');
    res.send(results);
})

app.get('/productos', async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM productos`);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/productos/:id/producto', async (req, res) => {
    const { id } = req.params;

    try {
        const [[results]] = await sequelize.query(
            'SELECT * FROM productos WHERE idproductos = ?',
            { replacements: [id] }
        );

        if (results) {
            const imagePath = results.url;
            res.send(results);
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error.message);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/productos/categoria/alimentos', async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM productos WHERE idCategoria = 1');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/citas', async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM cita`);
        res.json(results);
    }
    catch (error) {
        console.error('Error al obtener las citas:', error);
        res.status(500).send('Error al obtener las citas');
    }
});

app.get('/productos/categoria/Accesorios&Equipamiento', async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM productos WHERE idCategoria = 2');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/productos/categoria/Transportes&dormitorios', async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM productos WHERE idCategoria = 3');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.get('/productos/categoria/Higiene&Limpienza', async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM productos WHERE idCategoria = 4');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});

// FILTRADO DE MASCOTAS

app.get('/productos/mascota/todos', async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM productos WHERE razaMascota = "todos"`);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});
app.get('/productos/mascota/perro', async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM productos WHERE razaMascota = "perro"`);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});
app.get('/productos/mascota/gato', async (req, res) => {
    try {
        const [results] = await sequelize.query(`SELECT * FROM productos WHERE razaMascota = "gato"`);
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
});



// CONSULTA PARA CREAR LA TABLA GESTIONAR PRODUCTOS
app.get("/productos/categoria/gestion", async (req, res) => {
    try {
        const [results] = await sequelize.query(
            `SELECT p.idproductos, p.nombre, c.nombre AS "Nombre Categoria",
            p.precio, p.razaMascota, p.descripcion, p.url, p.is_visible, c.idCategoria  
            FROM productos p INNER JOIN categoria c ON p.idCategoria = c.idCategoria
            WHERE p.is_visible = TRUE;`
        );
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})
app.get("/productos/categoria/gestion/ocultos", async (req, res) => {
    try {
        const [results] = await sequelize.query(
            `SELECT p.idproductos, p.nombre, c.nombre AS "Nombre Categoria",
            p.precio, p.razaMascota, p.descripcion, p.url, p.is_visible , c.idCategoria 
            FROM productos p INNER JOIN categoria c ON p.idCategoria = c.idCategoria
            WHERE p.is_visible = FALSE;`
        );
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})

app.get("/productos/categoria/gestion/:categoria", async (req, res) => {
    try {
        const { categoria } = req.params;
        const [results] = await sequelize.query(
            `SELECT p.idproductos, p.nombre, c.nombre AS "Nombre Categoria",
                p.precio, p.razaMascota, p.descripcion, p.is_visible, p.url, c.idCategoria
                FROM productos p 
                INNER JOIN categoria c ON p.idCategoria = c.idCategoria
                WHERE c.idCategoria = ?;`,
            {
                replacements: [categoria]
            }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})

app.get("/productos/id/gestion/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await sequelize.query(
            `SELECT p.idproductos, p.nombre, c.nombre AS "Nombre Categoria",
                p.precio, p.razaMascota, p.descripcion, p.is_visible, p.url, c.idCategoria  
                FROM productos p
                INNER JOIN categoria c ON p.idCategoria = c.idCategoria
                WHERE p.idproductos = ?;`,
            {
                replacements: [id]
            }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})

app.put('/productos/:id/visibilidad/:estado', async (req, res) => {
    try {
        const { id, estado } = req.params;
        const isVisible = (parseInt(estado) === 1);

        const [results] = await sequelize.query(
            `UPDATE productos SET is_visible = ? WHERE idproductos = ?`,
            { replacements: [isVisible, id] }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).send('Error al actualizar el producto');
    }
});


app.get("/images/single", async (req, res) => {
    try {
        const { id } = req.params;
        const [results] = await sequelize.query(
            `SELECT p.idproductos, p.nombre, c.nombre AS "Nombre Categoria",
                p.precio, p.razaMascota, p.descripcion 
                FROM productos p 
                INNER JOIN categoria c ON p.idCategoria = c.idCategoria
                WHERE p.idproductos  = ?;`,
            {
                replacements: [id]
            }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
    }
})


app.post('/procesar-datos', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    try {

        const existeEmail = await fetch(`http://localhost:3000/email/existe/${email}`)

        const existenciaEmail = await existeEmail.json();

        if (existenciaEmail.existe) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado', existenciaCorreo: true });
        }
        const [results] = await sequelize.query(
            'INSERT INTO usuario (username, email, contrasena, rol) VALUES (?, ?, ?, ?)',
            { replacements: [name, email, password, "cliente"] }
        );
        console.log(results);
        if (name && email && password) {

            const [[conexionResults]] = await sequelize.query(
                'SELECT * FROM conexion WHERE usuarioid = ?',
                { replacements: [results] }
            );
            if(conexionResults){ // YA HAY UNA CONEXION 
                console.log("TIENE CONEXION");
            }else{// EL USUARIO NO TIENE UNA CONEXION
                const [[idcliente]] = await sequelize.query(
                    'SELECT idcliente FROM cliente WHERE correo = ?',
                    { replacements: [email] }
                );
                if(idcliente){// EL CORREO EXISTE EN USUARIO Y EN CLIENTE
                    await sequelize.query(
                        'INSERT INTO conexion (usuarioid, idcliente) VALUES (?, ?)',
                        { replacements: [results, idcliente.idcliente] }
                    );
                    console.log("salio bien papu");
                }
            }

            const token = jwt.sign({ email }, SECRET_KEY);
            res.json({ success: true, token, message: 'Datos recibidos correctamente', existenciaCorreo: false });
        } else {
            res.json({ success: false, message: 'Failed to register user.', existenciaCorreo: false });
        }
    } catch (error) {
        console.error('Error al insertar los datos:', error);
        res.status(500).json({ message: 'Error al procesar los datos', existenciaCorreo: false });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await sequelize.query(
            'SELECT * FROM usuario WHERE email = ? AND contrasena = ?',
            { replacements: [email, password] }
        );
        if (results.length > 0) {
            // PREGUNTA SI ES QUE ESTE ID YA ESTA CON UNA CONEXION
            const [[conexionResults]] = await sequelize.query(
                'SELECT * FROM conexion WHERE usuarioid = ?',
                { replacements: [results[0].idusuario] }
            );
            if(conexionResults){ // YA HAY UNA CONEXION 
                console.log("TIENE CONEXION");
            }else{// EL USUARIO NO TIENE UNA CONEXION
                const [[idcliente]] = await sequelize.query(
                    'SELECT idcliente FROM cliente WHERE correo = ?',
                    { replacements: [results[0].email] }
                );
                if(idcliente){// EL CORREO EXISTE EN USUARIO Y EN CLIENTE
                    await sequelize.query(
                        'INSERT INTO conexion (usuarioid, idcliente) VALUES (?, ?)',
                        { replacements: [results[0].idusuario, idcliente.idcliente] }
                    );
                }
            }
            // HAGAS UN SELECT INTO Y QUE MANDES EL CORREO LA CONTRASEÑA LA FECHA Y HORA // BOOLEANO LLAMADO ACCESS: TRUE
            const token = jwt.sign({ email: results[0].email }, SECRET_KEY);
            res.json({ token, results, success: true,  });
        } else {
            // HAGAS UN SELECT INTO Y QUE MANDES EL CORREO LA CONTRASEÑA LA FECHA Y HORA // BOOLEANO LLAMADO ACCESS: FALSE
            res.json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
});


app.get('/user-info', verifyToken, async (req, res) => {
    try {
        const [results] = await sequelize.query(
            'SELECT * FROM usuario WHERE email = ?',
            {
                replacements: [req.user.email]
            }
        );
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
});


app.post('/productos/envios', verifyToken, async (req, res) => {
    const { Distrito = null, CalleDireccion = null, comentarioAdicional = null,
        nombre, apellido, telefono,
        MetodoPago, productosGuardados } = req.body;

    const totalPrecio = await calcularTotal(productosGuardados);

    try {
        //INSERTAMOS EN USUARIO
        const [results] = await sequelize.query(
            'SELECT idusuario FROM usuario WHERE email = ?',
            {
                replacements: [req.user.email]
            }
        );
        console.log(results);

        if (Distrito && CalleDireccion) {
            const [result2] = await sequelize.query(
                `INSERT INTO compra (fecha,  idusuario, total, nombreComprador, apellidoComprador, distrito, CalleDireccion, comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                 VALUES (CURDATE(),?, ?, ?, ?, ?, ?, ?, ?, ?, 'Domicilio')`,
                {
                    replacements: [results[0].idusuario, totalPrecio, nombre, apellido, Distrito, CalleDireccion, comentarioAdicional, MetodoPago, telefono]
                }
            )
            await anidadirDetalle(result2, productosGuardados);
        } else {
            const [result2] = await sequelize.query(
                `INSERT INTO compra (fecha,  idusuario, total, nombreComprador, apellidoComprador, comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                 VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, 'Retiro Tienda')`,
                {
                    replacements: [results[0].idusuario, totalPrecio, nombre, apellido, comentarioAdicional, MetodoPago, telefono]
                }
            )
            await anidadirDetalle(result2, productosGuardados);
        }
        res.json(req.body)
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
})

app.get('/cliente/vacuna/mascota/:idmascota', verifyToken, VacunasMascota)
app.get('/cliente/desparasitacion/mascota/:idmascota', verifyToken, DesparacitacionMascota)


app.get('/pedidos', DetallePedidos)

app.get('/pedidos/productos/:idVenta', detallPedidoProducto)

app.get('/pedidos/Cancelled/:idVenta', detallPedidoCancelado)

//EXISTENCIA DEL EMAIL
app.get('/email/existe/:email', existeEmail)

//API MASCOTAS DEL CLIENTE
app.get("/api/cliente/mascotas", verifyToken, ArrayMascotas);

app.post('/crear-mascota', verifyToken, crearMascota);

app.put('/editar-mascota/cliente/:idmascota', verifyToken, editarMascota);

app.get('/datosCliente', verifyToken, obtenerInfoUsuarioPorCorreo);

app.put("/usuario/editar", verifyToken, editarDatosUsuario)

app.get('/buscarcliente/barra/:nombrecompleto', async (req, res) => {
    const { nombrecompleto } = req.params;
    try {
        const result = await sequelize.query(
            'CALL buscar_nombres_cliente_barra(:nombrecompleto)',
            { replacements: { nombrecompleto: nombrecompleto } }
        );

        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.post('/nuevocliente', async (req, res) => {
    let { nombresCliente, apellidosCliente, telefonoCliente = null, nombreMascota, razaMascota = null, especieMascota, sexoMascota, correo = null } = req.body;


    if (telefonoCliente == '') {
        telefonoCliente = null;
    }
    if (razaMascota == '') {
        razaMascota = null;
    }
    if (correo == '') {
        correo = null;
    }

    try {
        const [{ id_cliente }] = await sequelize.query(
            `CALL CREAR_CLIENTE(?, ?, ?, ?)`, // Añadir el cuarto parámetro para el correo
            { replacements: [nombresCliente, apellidosCliente, telefonoCliente, correo] } // Incluir el correo en los replacements
        );
        const [{ idmascota }] = await sequelize.query(
            `CALL CREAR_MASCOTA(?, ?, ?, ?, ?)`,
            { replacements: [nombreMascota, especieMascota, razaMascota, sexoMascota, id_cliente] }
        );

        await sequelize.query(
            `INSERT INTO historialmedico (idmascota) VALUES (?)`,
            { replacements: [idmascota] }
        );

        if (id_cliente) {
            res.json({ message: "Datos Subidos", idmascota, nombreMascota, nombreCompleto: `${nombresCliente} ${apellidosCliente}` });
        } else {
            res.status(400).json({ message: "Error al subir los datos" });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.post('/aniadirmascota/:idcliente', async (req, res) => {
    const idCliente = req.params.idcliente;
    let { nombreMascota, especieMascota, razaMascota = null, sexoMascota } = req.body;

    if (razaMascota == "") {
        razaMascota = null
    }

    try {
        const [{ idmascota }] = await sequelize.query(
            `CALL CREAR_MASCOTA(?, ?, ?, ?, ?)`,
            { replacements: [nombreMascota, especieMascota, razaMascota, sexoMascota, idCliente] }
        );

        await sequelize.query(
            `INSERT INTO historialmedico (idmascota) VALUES (?)`,
            { replacements: [idmascota] }
        );

        res.json({ idmascota: idmascota, nombreMascota: nombreMascota });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
})

app.get("/obtenerMascotas/cliente/:clienteid", async (req, res) => {
    const { clienteid } = req.params;

    try {
        const results = await sequelize.query(
            `CALL usuario_mascotas_verdetalle(?)`,
            { replacements: [clienteid] }
        );

        res.json(results)
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
})

app.post('/crearsesion/:idmascota', async (req, res) => {
    const { idmascota } = req.params;
    let { monto, masinfo, fecha, servicios = [] } = req.body;
    try {
        await sequelize.query(
            `CALL crear_sesion(?, ?, ?, ?)`,
            { replacements: [idmascota, monto, masinfo, fecha] }
        );
        const [result] = await sequelize.query(
            `SELECT LAST_INSERT_ID() as id_sesion`
        );
        const id_sesion = result[0].id_sesion;

        for (const servicio of servicios) {
            await sequelize.query(
                `CALL crear_servicio(?, ?)`,
                { replacements: [id_sesion, servicio] }
            );
        }

        res.status(200).json({ message: 'Sesión y servicios creados con éxito' });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});


// OBTENER DATOS PARA EL HISTORIAL MEDICO
app.get("/vacunas/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );
        const results_2 = await sequelize.query(
            `CALL get_by_id_vac(?)`,
            { replacements: [idHistorialMedico] }
        );
        res.json(results_2);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});
app.get("/vacuna/unasola/:idvacuna", async (req, res) => {
    const { idvacuna } = req.params;
    try {
        const [results] = await sequelize.query(
            `SELECT * FROM vacuna WHERE idvacuna = ?`,
            { replacements: [idvacuna] }
        );
        res.json(results);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.put('/vacuna/actualizar/:idvacuna', async (req, res) => {
    const { idvacuna } = req.params;
    const { fecha, tipoVacunacion, temperatura, peso, proxvacu, FC, FR } = req.body;

    try {
        const [results] = await sequelize.query(
            `UPDATE vacuna SET 
                fecha = IFNULL(?, fecha), 
                tipoVacunacion = IFNULL(?, tipoVacunacion), 
                temperatura = IFNULL(?, temperatura), 
                peso = IFNULL(?, peso), 
                prox_fecha = IFNULL(?, prox_fecha), 
                vac_frecuenciaCardiaca = IFNULL(?, vac_frecuenciaCardiaca), 
                vac_frecuenciaRespiratoria = IFNULL(?, vac_frecuenciaRespiratoria) 
            WHERE idvacuna = ?`,
            {
                replacements: [fecha, tipoVacunacion, temperatura, peso, proxvacu, FC, FR, idvacuna]
            }
        );

        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Vacuna actualizada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la vacuna' });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.delete('/vacuna/eliminar/:idvacuna', async (req, res) => {
    const { idvacuna } = req.params;
    try {
        const [result] = await sequelize.query(
            `DELETE FROM vacuna WHERE idvacuna = ?`,
            { replacements: [idvacuna] }
        );
        console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Vacuna eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la vacuna' });
        }
    } catch (error) {
        console.error('Error al eliminar la vacuna:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.delete('/desparasitacion/eliminar/:iddesparasitacion', async (req, res) => {
    const { iddesparasitacion } = req.params;
    try {
        const [result] = await sequelize.query(
            `DELETE FROM desparasitacion WHERE idDesparasitacion = ?`,
            { replacements: [iddesparasitacion] }
        );
        console.log(result);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Desparasitación eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la desparasitación' });
        }
    } catch (error) {
        console.error('Error al eliminar la desparasitación:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});


app.get("/desparacitaciones/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );
        const results_2 = await sequelize.query(
            `CALL get_by_id_despara(?)`,
            { replacements: [idHistorialMedico] }
        );
        res.json(results_2);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});
app.get('/desparasitacion/mascota/:iddesparasitacion', async (req, res) => {
    const { iddesparasitacion } = req.params;
    try {
        const [results] = await sequelize.query(
            `SELECT * FROM desparasitacion WHERE idDesparasitacion = ?`,
            { replacements: [iddesparasitacion] }
        );
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'No se encontró la desparasitación' });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.put('/actualizar/desparasitacion/mascota/:iddesparasitacion', async (req, res) => {
    const { iddesparasitacion } = req.params;
    const { fecha, producto, peso, proxfecha, dosis, tipo } = req.body;

    try {
        const resultado = await sequelize.query(
            `UPDATE desparasitacion SET 
                fecha = IFNULL(?, fecha), 
                producto = IFNULL(?, producto), 
                peso = IFNULL(?, peso), 
                prox_fecha = IFNULL(?, prox_fecha), 
                dosis = IFNULL(?, dosis), 
                tipo = IFNULL(?, tipo)
            WHERE idDesparasitacion = ?`,
            { replacements: [fecha, producto, peso, proxfecha, dosis, tipo, iddesparasitacion] }
        );

        if (resultado[0].affectedRows > 0) {
            res.status(200).json({ message: 'Desparasitación actualizada con éxito' });
        } else {
            res.status(404).json({ message: 'No se encontró la desparasitación' });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get("/revisionmedica/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );
        const results_2 = await sequelize.query(
            `CALL get_by_id_revmed(?)`,
            { replacements: [idHistorialMedico] }
        );
        res.json(results_2);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.delete('/revisionmedica/eliminar/:idrevisionmedica', async (req, res) => {
    const { idrevisionmedica } = req.params;
    try {
        const [result] = await sequelize.query(
            `DELETE FROM revisionmedica WHERE idRevisionMedica = ?`,
            { replacements: [idrevisionmedica] }
        );
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Revisión médica eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la revisión médica' });
        }
    } catch (error) {
        console.error('Error al eliminar la revisión médica:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get("/obtenerdatocliente/mascota/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    try {
        const [cliente] = await sequelize.query(
            `CALL mascota_cliente_verdetalle(?)`,
            { replacements: [idmascota] }
        );
        const [mascota] = await sequelize.query(
            `CALL mascotas_verdetalle(?)`,
            { replacements: [idmascota] }
        );


        res.json({ cliente, mascota });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
})

// actualizarMascota
app.put("/mascota/update/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    const { nombre_mascota, especie, raza, color, sexo, obs, fecha_nacimiento } = req.body;
    try {
        await sequelize.query(
            `CALL update_mascota_histmed(?, ?, ?, ?, ?, ?, ?, ?)`,
            { replacements: [idmascota, nombre_mascota, especie, raza, color, sexo, obs, fecha_nacimiento] }
        );
        res.status(200).json({ message: 'Mascota actualizada correctamente' });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// ActualizarCliente
app.put("/usuario/update/:idmascota", async (req, res) => {
    const { idmascota } = req.params; // es el id mascota
    const { nombre_cliente, apellido, direccion = null, telefono = null , correo } = req.body;
    try {

        const [{ idcliente }] = await sequelize.query(
            `CALL mascota_cliente_verdetalle(?)`,
            { replacements: [idmascota] }
        );
        await sequelize.query(
            `CALL update_cliente_histmed(?, ?, ?, ?, ?, ?)`,
            { replacements: [idcliente, nombre_cliente, apellido, direccion, telefono, correo] }
        );
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// ACTUALIZAR VACUNAS DESPARA HISTORIA CLINICA
app.post("/revmed/aniadir/:idmascota", async (req, res) => {
    const { idmascota } = req.params;
    const {
        fecha,
        temperatura = null,
        frecuenciaCardiaca = null,
        frecuenciaRespiratoria = null,
        peso = null,
        mucosas = null,
        glucosa = null,
        TLC = null,
        anamnesis = null,
        examRealizados = null,
        diagnosticoPresuntivo = null,
        tratamiento = null,
        receta = null
    } = req.body;
    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );

        await sequelize.query(
            `CALL post_by_id_revmed(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            {
                replacements: [
                    idHistorialMedico,
                    fecha,
                    temperatura,
                    frecuenciaCardiaca,
                    frecuenciaRespiratoria,
                    peso,
                    mucosas,
                    glucosa,
                    TLC,
                    anamnesis,
                    diagnosticoPresuntivo,
                    tratamiento,
                    receta,
                    examRealizados
                ]
            });
        res.status(200).json({
            message: 'Estado medico añadido con exito creados con éxito'
        });
    } catch (error) {
        console.error('Error al obtener el ID de historial médico:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.put("/revmed/actualizar/:idrevmed",actualizahistorialMedico);

app.get('/revisionmedica/unica/:idrevisionmedica', async (req, res) => {
    const { idrevisionmedica } = req.params;
    try {
        const [results] = await sequelize.query(
            `SELECT * FROM revisionmedica WHERE idRevisionMedica = ?`,
            { replacements: [idrevisionmedica] }
        );

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'No se encontró la revisión médica' });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.post('/vacuna/aniadir/:idmascota', async (req, res) => {
    const { idmascota } = req.params;
    let { fecha, tipoVacunacion, temperatura = null, peso = null, proxvacu = null,
        FC = null, FR = null
    } = req.body;

    if (temperatura == '') {
        temperatura = null
    }
    if (peso == '') {
        peso = null
    }

    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );
        if (idHistorialMedico) {
            await sequelize.query(
                `CALL post_by_id_vac(?, ?, ?, ?, ?, ?, ?, ?)`,
                { replacements: [idHistorialMedico, fecha, tipoVacunacion, temperatura, peso, FC, FR, proxvacu] }
            );
            res.status(200).json({ message: 'Vacuna creada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el historial médico para la mascota' });
        }
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});


app.post('/desparasitacion/aniadir/:idmascota', async (req, res) => {
    const { idmascota } = req.params;
    let { fecha, producto, peso = null, dosis = null, tipo = null, proxfecha = null } = req.body;

    if (peso == '') {
        peso = null;
    }
    if (dosis == '') {
        dosis = null;
    }
    if (tipo == '') {
        tipo = null;
    }
    if (proxfecha == '') {
        proxfecha = null;
    }

    try {
        const [{ idHistorialMedico }] = await sequelize.query(
            `CALL get_idmas_by_idhis(?)`,
            { replacements: [idmascota] }
        );

        const resultado = await sequelize.query(
            `CALL post_by_id_despara(?, ?, ?, ?, ?, ?, ?);`,
            { replacements: [idHistorialMedico, fecha, producto, peso, dosis, tipo, proxfecha] }
        );
        res.status(200).json({ message: 'Desparasitacion añadida con éxito' });
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/sesiones', obtenerSesiones);
app.get('/clientes', obtenerClientes);
app.get('/mascotas/nombreUsuario', obtenerMascotas);
app.get('/historialMedico', obtenerHistorialMedico);
app.get('/usuarios', obtenerUsuarios);


app.get('/sesiones/servicios/:idsesion', async (req, res) => {
    const { idsesion } = req.params;
    try {
        const [results] = await sequelize.query(`SELECT * FROM servicio s WHERE s.idsesion = ?`,
            { replacements: [idsesion] });
        res.json(results);
    } catch (error) {
        console.error('Error al obtener las sesiones:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/clientes/historial/:nombre_masc/:nombre_clie', async (req, res) => {
    let { nombre_masc = null, nombre_clie = null } = req.params;

    if (nombre_masc == 'null') {
        nombre_masc = null;
    }
    if (nombre_clie == 'null') {
        nombre_clie = null;
    }
    try {
        const idhistorial = await sequelize.query(
            `CALL filtro_historial(?, ?);`,
            { replacements: [nombre_masc, nombre_clie] }
        );
        res.json(idhistorial);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

app.get('/sesiones/filtros/mascota/:nombreMascota', async (req, res) => {
    const { nombreMascota } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_buscar_by_gestion_mascota_name(?)',
            { replacements: [nombreMascota] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/sesiones/filtros/cliente/:nombreCliente', async (req, res) => {
    const { nombreCliente } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_buscar_by_gestion_cliente_name(?)',
            { replacements: [nombreCliente] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/usuario/filtros/nombre/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_buscar_usuario_by_usuario_name(?)',
            { replacements: [name] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/usuario/filtros/correo/:eMail', async (req, res) => {
    const { eMail } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_buscar_usuario_by_usuario_email(?)',
            { replacements: [eMail] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/sesiones/filtroFecha/:fecha', async (req, res) => {
    const { fecha } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_sesion_by_fecha(?)',
            { replacements: [fecha] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/sesiones/filtroMascota/:nombreMascota', async (req, res) => {
    const { nombreMascota } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_sesion_by_nombre_mascota(?)',
            { replacements: [nombreMascota] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/sesiones/filtroCliente/:nombreCliente', async (req, res) => {
    const { nombreCliente } = req.params;
    try {
        const result = await sequelize.query(
            'CALL filtro_sesion_by_nombre_cliente(?)',
            { replacements: [nombreCliente] }
        );
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles de la sesión:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

app.get('/clientes/filtroNombre/:nombreCliente', async (req, res) => {
    const { nombreCliente } = req.params;
    try {
        const result = await sequelize.query(
            'CALL obtener_cliente_por_nombre(?)',
            { replacements: [nombreCliente] }
        );
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No se encontraron coincidencias');
        }
    } catch (error) {
        console.error('Error al obtener los detalles del cliente:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});



app.listen(port, () => {
    console.log('Mi port ' + port);
});
