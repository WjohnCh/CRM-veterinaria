const sequelize = require('./libs/conexionMsql')
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;

const {idUserByCorreo, calcularTotal, anidadirDetalle, DetallePedidos, detallPedidoProducto} = require('./indexUsuario.js')


const fs = require('node:fs');

const multer = require('multer');
const upload = multer({dest: './src/uploads/'});

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
    const {Distrito, CalleDireccion,comentarioAdicional = '-',
        correo,nombre,apellido ,telefono,dni,
        MetodoPago, productosGuardados} = req.body;

        const totalPrecio  = await calcularTotal(productosGuardados);
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
                const [result2]= await sequelize.query(
                    `INSERT INTO compra (fecha,  clienteid, total, distrito, CalleDireccion, comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                     VALUES (CURDATE(),?, ?, ?, ?, ?, ?,?, 'Domicilio')`,
                    {
                        replacements: [ results[0].idcliente,totalPrecio, Distrito, CalleDireccion, comentarioAdicional, MetodoPago, telefono]
                    }
                )
                await anidadirDetalle(result2, productosGuardados);
                
            }else{
                const [result2]= await sequelize.query(
                    `INSERT INTO compra (fecha,  clienteid, total,  comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                     VALUES (CURDATE(), ?, ?, ?, ?, ?, 'Retiro Tienda')`,
                    {
                        replacements: [ results[0].idcliente, totalPrecio, comentarioAdicional, MetodoPago, telefono]
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

app.post('/images/single', upload.single('avatar'), async (req, res)=>{
    const file = req.file;
    const { nombre, precio, categoria, descripcion, mascota } = req.body;

    const newPath = `./src/uploads/${file.originalname}`
    try {
        fs.renameSync(file.path, newPath);

        await sequelize.query(
            `INSERT INTO productos (nombre, precio, razaMascota,  url, idCategoria, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            { replacements: [nombre, parseFloat(precio),mascota, newPath, parseInt(categoria), descripcion] }
        );
        res.send('Archivo subido y movido exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al mover el archivo');
    }
})

app.put('/update/products/:id', upload.single('avatar'), async (req, res)=>{
    const { id } = req.params
    const file = req.file;
    const { nombre, precio, categoria, descripcion, mascota } = req.body;

    let newPath;

    try {
        let query;
        if(file){
            newPath = `./src/uploads/${file.originalname}`
            fs.renameSync(file.path, newPath);
            [query] = await sequelize.query(
                    ` UPDATE productos SET 
                    nombre = ?, precio = ?, razaMascota = ?, url = ?, idCategoria = ?, descripcion = ?
                    WHERE idproductos = ?`,
                    { replacements: [nombre, parseFloat(precio), mascota , newPath, parseInt(categoria), descripcion, parseInt(id)] }
                );
        }else{
            [query] = await sequelize.query(
                    ` UPDATE productos SET 
                    nombre = ?, precio = ?, razaMascota = ?, idCategoria = ?, descripcion = ?
                    WHERE idproductos = ?`,
                    { replacements: [nombre, parseFloat(precio), mascota, parseInt(categoria), descripcion, parseInt(id)] }
                );
        }
        res.json(query);
    } catch (error) {
        console.error("console.error('Error al actualizar el producto:', error);",error);
        res.status(500).send('Error al actualizar el producto');
    }
})




app.get('/', async (req, res)=>{
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

app.get('/citas', async(req, res) =>{
    try{
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
app.get("/productos/categoria/gestion", async (req, res)=>{
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
app.get("/productos/categoria/gestion/ocultos", async (req, res)=>{
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

app.get("/productos/categoria/gestion/:categoria", async (req, res)=>{
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

app.get("/productos/id/gestion/:id", async (req, res)=>{
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


app.get("/images/single", async (req, res)=>{
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
  
    try {
         await sequelize.query(
            'INSERT INTO usuario (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)',
            { replacements: [name, email, password,"cliente" ] }
          );

          const idUser = await idUserByCorreo(email)

          await sequelize.query(
            'INSERT INTO cliente (usuarioid) VALUES (?)',
            { replacements: [idUser] }
          );

          if (name && email && password) {
            const token = jwt.sign({ email }, SECRET_KEY);
            res.json({ success: true, token, message: 'Datos recibidos correctamente' });
        } else {
            res.json({ success: false, message: 'Failed to register user.'});
        }
      } catch (error) {
        console.error('Error al insertar los datos:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
      }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await sequelize.query(
            'SELECT * FROM usuario WHERE email = ? AND contrasena = ?',
            { replacements: [email, password]}
        );
        if (results.length > 0) {
            const token = jwt.sign({ email: results[0].email }, SECRET_KEY);
            res.json({token, results, success: true});
        } else {
            res.json({ success: false, message: 'Invalid email or password.'});
        }
    } catch (error){
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
            res.status(404).json({ message: 'User not found'});
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
});


app.post('/productos/envios', verifyCorreo, async (req,res)=>{
    const {Distrito, CalleDireccion,comentarioAdicional = '-',
        correo,nombre,apellido ,telefono,dni,
        MetodoPago, productosGuardados} = req.body;

    const totalPrecio  = await calcularTotal(productosGuardados);

    try {
        //INSERTAMOS EN USUARIO
        await sequelize.query(`INSERT INTO usuario (email, nombre, apellido, telefono, rol) VALUES (?,?,?,?, 'cliente')`,
            {
                replacements: [correo,nombre,apellido, telefono]
            }
        )
        // OBTENEMOS DE USUARIO SU ID PARA INSERTARLO EN CLIENTE
        const usuarioId = await idUserByCorreo(correo);


        const [idCliente] = await sequelize.query(`INSERT INTO cliente (usuarioid, direccion,dni) VALUES (?,?,?)`,
            {
                replacements: [usuarioId, CalleDireccion, dni]
            }
        )
        if (Distrito && CalleDireccion) {
            const [result2] = await sequelize.query(
                `INSERT INTO compra (fecha,  clienteid, total, distrito, CalleDireccion, comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                 VALUES (CURDATE(),?, ?, ?, ?, ?, ?,?, 'Domicilio')`,
                {
                    replacements: [ idCliente,totalPrecio, Distrito, CalleDireccion, comentarioAdicional, MetodoPago, telefono]
                }
            )
            await anidadirDetalle(result2, productosGuardados);
        }else{
            const [result2] = await sequelize.query(
                `INSERT INTO compra (fecha,  clienteid, total,  comentarios, metododePago,  telefonoEnvio, tipoEnvio) 
                 VALUES (CURDATE(), ?, ?, ?, ?, ?, 'Retiro Tienda')`,
                {
                    replacements: [ idCliente, totalPrecio, comentarioAdicional, MetodoPago, telefono]
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

app.get('/pedidos', DetallePedidos)


app.get('/pedidos/productos/:idVenta', detallPedidoProducto)

app.listen(port, () => {
    console.log('Mi port ' +  port);
  });
  