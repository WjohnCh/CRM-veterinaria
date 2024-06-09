export function actualizaSubtotalCarrito(){
    // const preciosProductos = Array.from(document.getElementsByClassName("carrito__precio-producto"));
    const contenedorCarrito = document.querySelectorAll('[idproductocarrito]');
    const Subtotal = document.querySelector(".precio-total-subtotal");
    let valores = [];
    let valorTotal = 0;
    
    for(let i = 0; i < contenedorCarrito.length; i++){
        const cantidadProducto = parseInt(contenedorCarrito[i].querySelector(".input__cantidad-producto").value);
        valores[i] = parseFloat(contenedorCarrito[i].querySelector(".carrito__precio-producto").innerText);

        valorTotal += (valores[i] * cantidadProducto);
    }
    Subtotal.innerText = valorTotal.toFixed(2);
}