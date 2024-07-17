const sequelize = require('./libs/conexionMsql')
const validator = require('validator');
async function DatosUser(req, res) {
    try {
        const [results] = await sequelize.query(
            'SELECT  FROM usuario WHERE email = ?',
            {
                replacements: [req.user.email]
            }
        );
        if (results.length > 0) {
            res.json({ idUsuario: results[0].idusuario });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
}

// obtener el id del Usuario Mediante el correo

async function idUserByCorreo(correo) {
    try {
        const [results] = await sequelize.query(
            'SELECT idusuario FROM usuario WHERE email = ?',
            {
                replacements: [correo]
            }
        );
        if (results.length > 0) {
            return results[0].idusuario;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        throw error;
    }
}



async function calcularTotal(Productos) {
    let totalProductos = 0;

    try {
        const precios = await Promise.all(Productos.map(async (producto) => {
            const response = await fetch(`http://localhost:3000/productos/${producto.idproductos}/producto`);
            if (!response.ok) {
                throw new Error(`Error al obtener el producto con id ${producto.idproductos}`);
            }
            const result = await response.json();
            return result.precio * producto.cantidad;
        }));

        totalProductos = precios.reduce((sum, precio) => sum + precio, 0);

    } catch (error) {
        console.error('Error al calcular el total de productos:', error);
        throw error; // Propagar el error para manejarlo en el contexto de llamada
    }

    return totalProductos
}
// const productos = [
//     { idproductos: 1, cantidad: 2 },
//     { idproductos: 2, cantidad: 1 },
//     // Más productos
// ];
// anidadirDetalle(15, productos)


async function anidadirDetalle(idventa, Productos) {

    try {
        for (const producto of Productos) {
            const response = await fetch(`http://localhost:3000/productos/${producto.idproductos}/producto`);
            if (!response.ok) {
                throw new Error(`Error al obtener el producto con id ${producto.idproductos}`);
            }

            const result = await response.json();

            await sequelize.query(
                "INSERT INTO detalle_compra (ventaid, productosid, precio_instante, cantidad) VALUES (?,?,?,?)",
                {
                    replacements: [idventa, result.idproductos, result.precio, producto.cantidad]
                }
            );
        }
    } catch (error) {
        console.error('Error al calcular el total de productos:', error);
        throw error; // Propagar el error para manejarlo en el contexto de llamada
    }
}

async function DetallePedidos(req, res) {
    try {
        const [results] = await sequelize.query(`SELECT CONCAT(co.nombreComprador, ' ', co.apellidoComprador) AS nombre_completo, 
                            co.telefonoEnvio, co.fecha, co.total, co.metododePago, co.tipoEnvio, 
                            co.comentarios, co.idcompra, u.email, co.distrito, co.CalleDireccion
                            FROM usuario as u INNER JOIN compra as co
                            ON co.idusuario= u.idusuario
                            WHERE isCancelled = 0`);
        res.json(results);
    } catch (error) {
        console.error('ERROR AL PROCESAR LA SOLICITUD', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

async function detallPedidoProducto(req, res) {
    const { idVenta } = req.params;

    try {
        const [results] = await sequelize.query(`SELECT precio_instante, cantidad, nombre FROM detalle_compra dc INNER JOIN
                                            productos as p ON p.idproductos = dc.productosid
                                            WHERE dc.ventaid = ?`,
            {
                replacements: [idVenta]
            })
        res.json(results)
    } catch (error) {
        console.error('ERROR AL PROCESAR LA SOLICITUD', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

async function detallPedidoCancelado(req, res) {
    const { idVenta } = req.params;
    try {
        const [result] = await sequelize.query(
            `UPDATE compra SET isCancelled = TRUE WHERE idcompra = ?`,
            {
                replacements: [idVenta]
            }
        );
        res.json(result)
    } catch (error) {
        console.error('ERROR AL PROCESAR LA SOLICITUD', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

async function existeEmail(req, res) {
    const { email } = req.params;
    try {
        const [result] = await sequelize.query(
            `SELECT idusuario FROM usuario WHERE email = ?`,
            {
                replacements: [email]
            }
        );
        if (result.length == 1) {
            res.json({ existe: true })
        } else {
            res.json({ existe: false })
        }
    } catch (error) {
        console.error('ERROR AL PROCESAR LA SOLICITUD', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

// FUNCION QUE DEVUELVE LAS MASCOTAS DE UN CLIENTE
async function ArrayMascotas(req, res) {
    try {
        const [results] = await sequelize.query(
            "CALL obtener_idUsuarioXCorreo(?)",
            {
                replacements: [req.user.email],
            }
        );
        if (results) {
            const resultado = await sequelize.query(
                "CALL usuario_mascotas_verdetalle(?)",
                {
                    replacements: [results.idcliente],
                }
            );

            if (resultado.length == 0) {
                res.json({ pets: false, message: "Sin Mascotas" });
            } else {
                res.json(resultado);
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error al obtener los datos de las mascotas:", error.message);
        res.status(500).send("Error al procesar la solicitud");
    }
}

// CREAR NUEVAS MASCOTAS
const crearMascota = async (req, res) => {
    let { nombre_mascota, fecha_nacimiento, especie, raza = null, peso = null, color, sexo } = req.body;

    if (raza == '') {
        raza = null;
    }
    if (peso == '') {
        peso = null;
    }
    // Validación de los datos
    if (!nombre_mascota || !fecha_nacimiento || !especie || !color || !sexo) {
        return res.json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const isValidDate = value => !isNaN(Date.parse(value));
    const isString = value => typeof value === 'string';

    if (!isString(nombre_mascota) || !isValidDate(fecha_nacimiento) || !isString(especie)
        || !isString(color) || !isString(sexo)) {
        return res.json({ success: false, message: 'Formato de datos incorrecto' });
    }

    try {
        const [results] = await sequelize.query(
            "CALL obtener_idUsuarioXCorreo(?)",
            {
                replacements: [req.user.email],
            }
        );
        if (results) {
            await sequelize.query(
                `INSERT INTO mascota (nombre_mascota, clienteid, fecha_nacimiento, especie, raza, peso, color, sexo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                { replacements: [nombre_mascota, results.idcliente, fecha_nacimiento, especie, raza, peso, color, sexo] }
            );
            res.json({ success: true });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error al insertar la mascota:', error.message);
        res.status(500).json({ success: false, message: 'Error al procesar los datos', error: error.message });
    }

};
const editarMascota = async (req, res) => {
    const { nombre_mascota, fecha_nacimiento, raza, peso} = req.body;
    const { idmascota } = req.params

    if (!validator.isLength(nombre_mascota, { min: 1 }) ||
        !validator.isDate(fecha_nacimiento) ||
        !validator.isLength(raza, { min: 1 }) ||
        !validator.isFloat(peso, { min: 0 })) {
        return res.json({ success: false, message: 'Formato de datos incorrecto' });
    }
    console.log(req.body);
    console.log(req.params);
    try {
        const [results] = await sequelize.query(
            "CALL obtener_idUsuarioXCorreo(?)",
            {
                replacements: [req.user.email],
            }
        );
        if (results) {
            const [result] = await sequelize.query(
                `UPDATE mascota m
                JOIN cliente c ON m.clienteid = c.idcliente
                SET m.nombre_mascota = ?, m.fecha_nacimiento = ?, m.raza = ?, m.peso = ?
                WHERE m.idmascota = ? AND c.idcliente = ?;
                `,
                { replacements: [nombre_mascota, fecha_nacimiento, raza, peso, idmascota, results.idcliente] }
            );
            if (result.affectedRows === 0) {
                return res.json({ success: false, message: 'Cliente no encontrado o mascota no actualizada' });
            }
            res.json({ success: true });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error al actualizar la mascota:', error.message);
        res.status(500).json({ success: false, message: 'Error al procesar los datos', error: error.message });
    }
};

const obtenerInfoUsuarioPorCorreo = async (req, res) => {
    const email = req.user.email;

    try {
        const results = await sequelize.query(
            "CALL obtener_info_usuario_por_correo(?)",
            {
                replacements: [email],
            }
        );

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const editarDatosUsuario = async (req, res) => {
    try {
      const id = req.user.email;
      const { nombreUser, telefono, contrasena, direccion } = req.body;
      try {
        await sequelize.query(
          `call editar_usuario(?, ?, ?, ?, ?)`,
          {
            replacements: [id, nombreUser, telefono,contrasena, direccion]
          }
        );
        res.json({success: true,
          message: "Usuario actualizado con éxito",});
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({ message: "Error al actualizar el usuario" });
    }
  }

  const obtenerSesiones = async (req, res) => {
    try {
        const [results] = await sequelize.query("CALL obtener_sesiones()");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener las sesiones:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const obtenerClientes = async (req, res) => {
    try {
        const results = await sequelize.query("CALL obtener_clientes()");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los clientes:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const obtenerMascotas = async (req, res) => {
    try {
        const results = await sequelize.query("CALL obtener_mascotas()");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener las mascotas:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const obtenerHistorialMedico = async (req, res) => {
    try {
        const [results] = await sequelize.query("CALL obtener_historial_medico()");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener el historial médico:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const results = await sequelize.query("CALL obtener_usuarios()");
        res.json(results);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
};





module.exports = {
    idUserByCorreo, calcularTotal, anidadirDetalle, DetallePedidos, detallPedidoProducto, detallPedidoCancelado,
    existeEmail, ArrayMascotas, crearMascota, editarMascota, obtenerInfoUsuarioPorCorreo, editarDatosUsuario,
    obtenerSesiones, obtenerClientes, obtenerMascotas, obtenerHistorialMedico, obtenerUsuarios,
};


