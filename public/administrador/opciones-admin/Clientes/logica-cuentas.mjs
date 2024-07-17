export async function logicaCuentas(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")

    try {
        const results = await fetch(`http://localhost:3000/usuarios`)
        const body = await results.json();
        
        body.forEach(usuario=>{
            crearUsuarioFila(usuario)
        })

    } catch (error) {
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
}

