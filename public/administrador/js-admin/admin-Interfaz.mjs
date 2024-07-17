import {mostrarTablaPedidos} from '../js-admin/admin-gestioPedidos.mjs'
import {LogicaSesion} from '../opciones-admin/Sesiones/logicaSesion.mjs';
import{VisualizarHistorialMedico} from "../opciones-admin/Historial-Medico/logica-historial.mjs"
import {logicaProducto} from "../opciones-admin/Productos/logica-productos.mjs"
import {logicaCliente} from "../opciones-admin/Clientes/logica-clientes.mjs"
import {logicaMascotas} from "../opciones-admin/Clientes/logica-mascota.mjs"
import {logicaCuentas} from "../opciones-admin/Clientes/logica-cuentas.mjs"

let idProductoParaActualizar = 0; // Este id servirá para indicarle al formulario que producto debe actualizar

export async function AbrirCerrarInterfaz() {
    const nuevaCita = document.getElementById("opcion_Nueva-Cita")
    const solicitudesCita = document.getElementById("opcion_Solicitudes")
    const GestionCitas = document.getElementById("opcion_Gestion-Cita")

    const gestionProductos = document.getElementById("opcion_Gestion-Productos")
    const gestionPedidos = document.getElementById("opcion_Gestion-Pedidos")

    const interfazNuevaCita = document.getElementById("Contenedor-general__Crear-Citas")
    const interfazSolicitudesCita = document.getElementById("Contenedor-general__Solicitudes-Citas")
    const interfazGestionCitas = document.getElementById("Contenedor-general__Gestion-Citas")
    const interfazGestionProductos = document.getElementById("Contenedor-general__Gestion-Productos")
    const interfazGestionPedidos = document.getElementById("Contenedor-general__Gestion-Pedidos")


    const filtradoTablaAccesorios = document.getElementById("Filtro-tabla_Accesorios");
    let UltimoContenedorClick = null;




    const CrearSesion = document.getElementById("contenedor-Crear-sesion-option")
    const Sesiones = document.getElementById("contenedor-sesiones-option")
    const Productos = document.getElementById("contenedor-productos-option")
    const Pedidos = document.getElementById("contenedor-pedidos-option")
    const Clientes = document.getElementById("contenedor-clientes-option")
    const Mascotas = document.getElementById("contenedor-mascotas-option")
    const HistorialMedico = document.getElementById("contenedor-historialMedico-option")
    const Cuentas = document.getElementById("contenedor-cuentas-option")


    const contenedorDinamico = document.getElementById("contenedor-main-admin")

    CrearSesion.addEventListener("click", async ()=>{
        await CargarContenido("Sesiones/NuevaSesion.html")
        await LogicaSesion();
    })

    Sesiones.addEventListener("click",async ()=>{

    })

    Productos.addEventListener("click",async ()=>{
        await CargarContenido("Productos/Gestion-Productos.html")
        await logicaProducto();
    })

    Pedidos.addEventListener("click",async()=>{
        await CargarContenido("Productos/Gestion-pedidos.html");
        await mostrarTablaPedidos();
    })

    Clientes.addEventListener("click",async()=>{
        await CargarContenido("Clientes/Gestionar-clientes.html");
        await logicaCliente()
    })

    Mascotas.addEventListener("click",async()=>{
        await CargarContenido("Clientes/Gestionar-mascota.html");
        await logicaMascotas()
    })

    HistorialMedico.addEventListener("click",async()=>{
        await CargarContenido("Historial-Medico/plantilla-historial.html")
        await VisualizarHistorialMedico();
    })

    Cuentas.addEventListener("click",async()=>{
        await CargarContenido("Clientes/Gestionar-cuentas.html");
        await logicaCuentas();
    })


    async function CargarContenido(url){
        try {
            let respuesta = await fetch(`/public/administrador/opciones-admin/${url}`);
            if (!respuesta.ok){
                throw new Error('Error al cargar los datos');
            }
            let contenido = await respuesta.text();
            contenedorDinamico.innerHTML = contenido

        } catch (error) {
            console.error('Error:', error);
        }
    }


    // FUNCION QUE LE DA ACCION DE CLICK A CADA ELEMENTO DEL FILTRO
    MostrarFiltradoTabla()
}

const ContenedorTabla = document.getElementById("Cuerpo_tabla-Gestion-Producto");
const plantilla = document.querySelector(".Fila_producto")
const ModalDetalleProducto = document.getElementById("modal-Detalle-Producto-tabla")
const equisCierremodalDetalleProducto = document.querySelector(".close-button"); // Equis que cierra el modal de detalle producto
// FUNCION QUE CREA LAS TABLAS SEGUN EL FILTRADO DE PRODUCTOS

// VARIABLES PARA DETALLES DEL PRODUCTO
const detalle_nombre = document.getElementById("detalle-producto_nombre")
const detalle_id = document.getElementById("detalle-producto_ID")
const detalle_precio = document.getElementById("detalle-producto_precio")
const detalle_categoria = document.getElementById("detalle-producto_Categoria")
const detalle_destinatario = document.getElementById("detalle-producto_Destinatario")
const detalle_img = document.getElementById("detalle__img")
const detalle_Descripcion = document.getElementById("Detalle-producto_descripcion")
const btn_editarProducto = document.getElementById("btn_EditarProducto")
const btn_ocultarProducto = document.getElementById("btn_OcultarProducto")

// elementos para editar un producto
const ctnFrmActualizarProducto = document.getElementById("Contenedor__Formulario-ActualizarProducto")
const inputActuNomProducto = document.getElementById("Actualizar-Producto_nombre")
const inputActuPriceProducto = document.getElementById("Actualizar-Producto_precio")
const inputActuDescripProducto = document.getElementById("Actualizar-Producto_descripcion")
const optionCategoria = document.getElementById("Actualizar-Producto_Categoria")
const optionDestinatario = document.getElementById("Actualizar-Producto_mascota")

const btnGeneralActualizar = document.getElementById("btn_generalActualizar-Producto")
let preguardadoCategoria;
let preguardadodestinatario;

//Elementos del los mensajes de ayuda (exito, error, advertencia)
const modalExito = document.getElementById("Modal-InterfazExito")
const modalRechazo = document.getElementById("Modal-InterfazRechazo")
const modalAdvertencia = document.getElementById("Modal-InterfazAdvertencia")
//BOTONES CADA UNO
const btnModalExito = modalExito.querySelector(".btn-Ayuda")
const btnModalRechazo = modalRechazo.querySelector(".btn-Ayuda")
const btnModalAdvertencia = modalAdvertencia.querySelector(".btn-Ayuda")
//Mensaje de cada uno
const mensajeModalAdvertencia = modalAdvertencia.querySelector(".Ayuda-text")

async function MostrarTablaObjeto(endopoint) {
    try {
        ContenedorTabla.innerText = ""
        const body = await fetch(endopoint);
        const productos = await body.json()

        productos.forEach((producto) => {
            crearFilaColumna(producto, ContenedorTabla, plantilla)
        })
    } catch (error) {
        console.error(error);
    }

    function crearFilaColumna(producto, ContenedorTabla, plantilla) {
        const nuevaFila = plantilla.cloneNode(true);
        const idProducto = nuevaFila.querySelector(".Valor-Tabla__id");
        const nombreProducto = nuevaFila.querySelector(".Valor-Tabla__nombre");
        const categoriaProducto = nuevaFila.querySelector(".Valor-Tabla__categoria");
        const precioProducto = nuevaFila.querySelector(".Valor-Tabla__precio");
        const descripcionProducto = nuevaFila.querySelector(".Valor-Tabla__descripcion");
        const imgMostrarDetalleProducto = nuevaFila.querySelector(".img_Mostrar-Detalle-Producto");

        // LOGICA PARA ABRIR Y CERRAR DETALLE DE PRODUCTOS
        imgMostrarDetalleProducto.addEventListener("click", () => {
            ModalDetalleProducto.style.display = "grid"
            detalle_nombre.innerText = producto.nombre
            detalle_id.innerText = producto.idproductos
            detalle_precio.innerText = `S/. ${producto.precio.toFixed(2)}`
            detalle_categoria.innerText = producto["Nombre Categoria"]
            detalle_destinatario.innerText = `Para ${producto.razaMascota}`
            detalle_img.src = `.${producto.url}`
            detalle_Descripcion.innerText = producto.descripcion

            if(producto.is_visible == false){
                btn_ocultarProducto.innerText = "Mostrar Producto"
                mensajeModalAdvertencia.innerText = "Este producto estará visible para el cliente en la página principal"
            }
            if(producto.is_visible == true){
                btn_ocultarProducto.innerText = "Ocultar Producto"
                mensajeModalAdvertencia.innerText = "Un producto ocultado no se mostrará al cliente en la página principal"
            }
            btn_editarProducto.onclick = ActualizarDatosProducto
            btn_ocultarProducto.onclick = MensajeDeAdvertencia; // Asigna a la funcion para ocultar producto
            btnGeneralActualizar.onclick = ActualizarProducto
        })
        // /update/products/:id
        async function MensajeDeAdvertencia(){

            modalAdvertencia.style.display = "grid"
            btnModalAdvertencia.onclick = ocultarMostrarProducto

            async function ocultarMostrarProducto(){
                modalAdvertencia.style.display = "none"
                try {
                    let response
                    if(producto.is_visible == true){
                        producto.is_visible = 0
                         response = await fetch(`http://localhost:3000/productos/${producto.idproductos}/visibilidad/0`, { method: 'PUT' });
                        btn_ocultarProducto.innerText = "Mostrar Producto"
                    }else if(producto.is_visible == false){
                        producto.is_visible = 1
                         response = await fetch(`http://localhost:3000/productos/${producto.idproductos}/visibilidad/1`, { method: 'PUT' });
                        btn_ocultarProducto.innerText = "Ocultar Producto"
                    }
                    if(response.ok){
                        modalExito.style.display = "grid"
                    }else{
                        modalRechazo.style.display = "grid"
                    }
                } catch (error){
                  console.error(error);
                }
            }
        }

        async function ActualizarProducto(event){
            idProductoParaActualizar = producto.idproductos
        }

        async function ActualizarDatosProducto(){
            ctnFrmActualizarProducto.style.display = "grid";
            ModalDetalleProducto.style.display = "none"
            inputActuNomProducto.value = producto.nombre;
            inputActuPriceProducto.value = producto.precio.toFixed(2);
            inputActuDescripProducto.value = producto.descripcion;
            // LLamamos variables auxiliares para predefin las OPTION
            if(preguardadoCategoria){
                preguardadoCategoria.selected = false;
            }
            if(preguardadodestinatario){
                preguardadodestinatario.selected = false;
            }
            preguardadoCategoria = optionCategoria.querySelector(`option[value="${producto.idCategoria}"]`)
            console.log(preguardadoCategoria);
            preguardadodestinatario = optionDestinatario.querySelector(`option[value="${producto.razaMascota}"]`)
            preguardadoCategoria.selected = true;
            preguardadodestinatario.selected = true;
        }
        idProducto.innerText = producto.idproductos;
        nombreProducto.innerText = producto.nombre;
        categoriaProducto.innerText = producto["Nombre Categoria"];
        precioProducto.innerText = producto.precio.toFixed(2);

        descripcionProducto.innerText = producto.descripcion;


        nuevaFila.style.display = "table-row";
        ContenedorTabla.appendChild(nuevaFila);
    }


}


const FiltroCategoriaTabla = document.getElementById("Filtro-tabla_categoria")

const botonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto");
const INPUTbotonBuscarID = document.getElementById("Buscar-Tabla_ID-Producto-INPUT");
const btnAniadirProducto = document.getElementById("Anidir-Producto-BD");
const frmAniadirProducto = document.getElementById("modal_MostrarFormulario-AñadirProducto")
const btnMostrarOcultos = document.getElementById("Estado-producto-BD");
const formActualizarProducto = document.getElementById('Formulario_ActualizarProductoBD');

async function MostrarFiltradoTabla() {

    FiltroCategoriaTabla.addEventListener("change", (event) => {
        const selectedValue = event.target.value;

        if (selectedValue === 'Filtro-tabla_Alimentos') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/1")
        } else if (selectedValue === 'Filtro-tabla_Accesorios') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/2")
        } else if (selectedValue === 'Filtro-tabla_Transportes') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/3")
        } else if (selectedValue === 'Filtro-tabla_Higiene') {
            MostrarTablaObjeto("http://localhost:3000/productos/categoria/gestion/4")
        }
    });

    botonBuscarID.addEventListener("click", () => {
        const valorID = parseInt(INPUTbotonBuscarID.value.trim());
        MostrarTablaObjeto(`http://localhost:3000/productos/id/gestion/${valorID}`)
    })

    btnAniadirProducto.addEventListener("click", () => {
        frmAniadirProducto.style.display = "grid";
    })

    // FUNCION QUE MUESTRA O OCULTA PRODUCTOS ELIMINADOS
    btnMostrarOcultos.addEventListener("click", ()=>{
        if(btnMostrarOcultos.innerText == "Mostrar Ocultos"){
            MostrarTablaObjeto(`http://localhost:3000/productos/categoria/gestion/ocultos`);
            btnMostrarOcultos.innerText = "No mostrar Ocultos";
            
        }else if(btnMostrarOcultos.innerText == "No mostrar Ocultos"){
            MostrarTablaObjeto(`http://localhost:3000/productos/categoria/gestion`)
            btnMostrarOcultos.innerText = "Mostrar Ocultos";
        }
    })

    formActualizarProducto.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = new FormData(formActualizarProducto);
        try {
            const response = await fetch(`http://localhost:3000/update/products/${idProductoParaActualizar}`,{
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {

                throw new Error('Error al actualizar el producto');
            }

            modalExito.style.display = "grid"
        } catch (error) {
            modalRechazo.style.display = "grid"
        }
    })
}


