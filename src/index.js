const sequelize = require('./libs/conexionMsql')
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

const fs = require('node:fs');
const multer = require('multer');
const upload = multer({dest: './src/uploads/'});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.post('/images/single', upload.single('avatar'), async (req, res)=>{
    const file = req.file;
    const { nombre, precio, categoria } = req.body;

    const newPath = `./src/uploads/${file.originalname}`
    try {
        fs.renameSync(file.path, newPath);
        const [idCategoria] = await sequelize.query(
            'SELECT idCategoria FROM categoria WHERE nombre = ?',
            { replacements: [categoria] }  
        );
        console.log(idCategoria);
        const [result] = await sequelize.query(
            'INSERT INTO productos (nombre, precio, url, idCategoria) VALUES (?, ?, ?, ?)',
            { replacements: [nombre, parseFloat(precio), newPath, idCategoria[0].idCategoria] }
        );
        res.send('Archivo subido y movido exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al mover el archivo');
    }
})

app.get('/productos/:id/image', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await sequelize.query(
            'SELECT url FROM productos WHERE idproductos = ?',
            { replacements: [id] }
        );

        if (results.length > 0) {
            const imagePath = results[0].url;
            res.sendFile(imagePath);
        } else {
            res.status(404).send('Producto no encontrado.');
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});


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

app.get('/productos/categoria/alimentos', async (req, res) => {
    try {
        const [results] = await sequelize.query('SELECT * FROM productos WHERE idCategoria = 1');
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error al obtener los productos');
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


app.post('/procesar-datos', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
        const [result] = await sequelize.query(
            'INSERT INTO usuario (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)',
            { replacements: [name, email, password,"cliente" ] }
          );
    
        // Simula una operación exitosa
        res.json({ message: 'Datos recibidos correctamente', id: result.insertId });
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
            { replacements: [email, password] }
        );

        if (results.length > 0) {
            res.json({ success: true, rol: results[0].rol });
        } else {
            res.json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
});



app.listen(port, () => {
    console.log('Mi port ' +  port);
  });
  