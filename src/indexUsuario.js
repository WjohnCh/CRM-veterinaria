const sequelize = require('./libs/conexionMsql')

async function DatosUser(req, res){
    try {
        const [results] = await sequelize.query(
            'SELECT  FROM usuario WHERE email = ?',
            {
                replacements: [req.user.email]
            }
        );
        if (results.length > 0) {
            res.json({ idUsuario: results[0].idusuario});
        } else {
            res.status(404).json({ message: 'User not found'});
        }
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        res.status(500).json({ message: 'Error al procesar los datos' });
    }
}

// obtener el id del Usuario Mediante el correo

async function idUserByCorreo(correo){
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

function CalcularSumaValores(){
    
}


async function calcularTotal(Productos){
    let totalProductos=0;

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


async function anidadirDetalle(idventa, Productos){

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



module.exports = {idUserByCorreo,calcularTotal, anidadirDetalle};


