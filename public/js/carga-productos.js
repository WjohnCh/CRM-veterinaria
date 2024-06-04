document.addEventListener("DOMContentLoaded", async ()=>{
    try {
        const response = await fetch('http://localhost:3000/productos');
        const products = await response.json();
        products.forEach(product => {
            CrearEstructuraObjeto(product, plantilla, productList);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }

    function CrearEstructuraObjeto(producto, plantilla, contenedor) {
        const nuevoProducto = plantilla.cloneNode(true);
        nuevoProducto.style.display = 'block';

        const precioProducto = nuevoProducto.querySelector('.precio-producto');
        const descripcionProducto = nuevoProducto.querySelector('.Nombre-producto');
        const imagenProducto = nuevoProducto.querySelector('.image-producto img');
        
        imagenProducto.src = `http://localhost:3000/productos/${producto.idproductos}/image`;
        imagenProducto.alt = producto.nombre;
        precioProducto.textContent = `$${producto.precio.toFixed(2)}`;
        descripcionProducto.textContent = producto.nombre;

        contenedor.appendChild(nuevoProducto);
    }



})