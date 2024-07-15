import {FuncionCargarProductos} from "./cliente-productos/carga-productos.mjs"
import {GestionMascotasCliente} from "./cliente-interfaces/GestionMascotasCliente.mjs"
import {cargarMisdatos} from "./cliente-interfaces/cliente-datos/micuenta-cliente.mjs"

document.addEventListener("DOMContentLoaded",async ()=>{
    const imgUser = document.getElementById("cliente-img user")
    const cerrarModalOpcionesAdmin = document.getElementById("modal-opcion-cliente-logout")
    const nombreUsuario = document.getElementById("nombreUser-token")
    
    const token = localStorage.getItem('token');

    const btnMisCompras = document.getElementById("btn_clienite-mis_compras")
    const btnMisMascotas = document.getElementById("btn_clienite-mis_Mascotas")
    const btnMiCuenta = document.getElementById("btn_clienite-mi_cuenta")
    const btnProductos = document.getElementById("Cliente-listaProductos-Content")
    const contenedorDinamico = document.getElementById("caja_contenedora_cliente-content")
    const contenedorLogo = document.querySelector(".Container-Logo");

    imgUser.addEventListener("click", ()=>{
        cerrarModalOpcionesAdmin.classList.toggle("motrar-elemento");
    })

    document.addEventListener("click", (event)=>{
        if(event.target != cerrarModalOpcionesAdmin && event.target != imgUser){
            cerrarModalOpcionesAdmin.classList.remove("motrar-elemento");
        }
    })

    // LOGICA GENERAL A TODOS LOS MODALES
    const equis = document.querySelectorAll(".modal-generico");

    equis.forEach(element=>{

        const equisCerrar = element.querySelector(".equis-ubicacion")
        if(equisCerrar){
            equisCerrar.addEventListener("click", ()=>{
            element.style.display = "none";
        })           
        }

        element.addEventListener("click", (event)=>{
            if(event.target == element){
                element.style.display = "none";
            }
        })
    })
    
    try {
        const response = await fetch('http://localhost:3000/user-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const {username} = await response.json();
        nombreUsuario.innerText= username;
    } catch (error) {
        console.log(error)
    }


    const btnSalirCliente = document.getElementById("botonSalir-cliente")
    btnSalirCliente.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.href = '../navbar.html'
    })

    // LOGICA DE INFORMACION HISTORIAL DEL USUARIO

    await CargarContenido("Lista-productos+aside.html")
    await FuncionCargarProductos();

    contenedorLogo.addEventListener("click", async ()=>{
        await CargarContenido("Lista-productos+aside.html")
        await FuncionCargarProductos();
    })

    btnMisCompras.addEventListener("click",()=>{
    })
    btnMisMascotas.addEventListener("click",async()=>{
        await CargarContenido("Lista-mascotas.html");
        await GestionMascotasCliente();
    })
    btnMiCuenta.addEventListener("click",async ()=>{
        await CargarContenido("cliente-datos/mi-Cuenta.html");
        await cargarMisdatos();
    })
    btnProductos.addEventListener("click",async ()=>{
        await CargarContenido("Lista-productos.html")
        await FuncionCargarProductos();
    })

    async function CargarContenido(url){
        try {
            let respuesta = await fetch(`/public/cliente/cliente-interfaces/${url}`);
            if (!respuesta.ok){
                throw new Error('Error al cargar los datos');
            }
            let contenido = await respuesta.text();
            contenedorDinamico.innerHTML = contenido

        } catch (error) {
            console.error('Error:', error);
        }
    }
})