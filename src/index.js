const sequelize = require('./libs/conexionMsql')
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.get('/', async (req, res)=>{
    const [results] = await sequelize.query('SELECT * FROM productos WHERE idproductos = 1');
    // console.log('Query executed. Results:', results);
    res.send(results);
})

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
  