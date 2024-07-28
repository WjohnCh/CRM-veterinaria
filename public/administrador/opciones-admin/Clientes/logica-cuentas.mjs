const modalDeCarga = document.getElementById("loading-screen")
export async function logicaCuentas(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")

    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/usuarios`)
        const body = await results.json();
        
        if(results.ok){
            modalDeCarga.style.display = "none";
            body.forEach(usuario=>{
                crearUsuarioFila(usuario)
            })
        }else{
            modalDeCarga.style.display = "none";
        }

    } catch (error) {
        modalDeCarga.style.display = "none";
        console.error(error)
    }

    function crearUsuarioFila(usuario){
        const newUser = plantilla.cloneNode(true)
        const idUser = newUser.querySelector(".Valor-Tabla__ID")
        const nombreUser = newUser.querySelector(".Valor-Tabla__NombreUsuario")
        const email = newUser.querySelector(".Valor-Tabla__Email")
        const contrasena = newUser.querySelector(".Valor-Tabla__Contrasena")

        idUser.innerText = usuario.idusuario
        nombreUser.innerText = usuario.username
        email.innerText = usuario.email
        contrasena.value = usuario.contrasena

        const btnnewUser = newUser.querySelector(".btnVer")
        btnnewUser.addEventListener("click", ()=>{
            if (contrasena.type === "password") {
                contrasena.type = "text";
            } else {
                contrasena.type = "password";
            }
        })

        newUser.style.display = "table-row"
        contenedor.appendChild(newUser)
    }

    // ----------------------------------------------------------------------
    // ------------------LOGICA PARA FILTRAR MASCOTAS------------------------
    // ----------------------------------------------------------------------

    const inputCorreo = document.getElementById("Nombre_Cliente-gestionUsuario-filtro")
    const inputUsuario = document.getElementById("Nombre_Mascota-gestionUsuario-filtro")
    const btnCorreo = document.getElementById("btn-buscar-gestionUsuario-filtro")
    const btnUsuario = document.getElementById("btn-Mascota-gestionUsuario-filtro")

    btnCorreo.addEventListener("click", async ()=>{
        const valorinputCorreo = inputCorreo.value.trim();
        try {
            modalDeCarga.style.display = "flex";
            contenedor.innerText = "";
            const result = await fetch(`http://localhost:3000/usuario/filtros/correo/${valorinputCorreo}`)
            const body = await result.json();
            if (result.ok) {
                
                modalDeCarga.style.display = "none";
                body.forEach(usuario => {
                    crearUsuarioFila(usuario)
                })
            } else {
                modalDeCarga.style.display = "none";
                alert('OCURRIO UN ERROR VUELVA A INTENTARLO')
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })
    btnUsuario.addEventListener("click",async ()=>{
        const valorinputUsuario = inputUsuario.value.trim();
        try {
            modalDeCarga.style.display = "flex";
            contenedor.innerText = "";
            const result = await fetch(`http://localhost:3000/usuario/filtros/nombre/${valorinputUsuario}`)
            const body = await result.json();
            if (result.ok) {
                
                modalDeCarga.style.display = "none";
                body.forEach(usuario => {
                    crearUsuarioFila(usuario)
                })
            } else {
                modalDeCarga.style.display = "none";
                alert('OCURRIO UN ERROR VUELVA A INTENTARLO')
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    })

}

