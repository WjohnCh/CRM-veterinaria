export async function logicaMascotas(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")


    try {
        const results = await fetch(`http://localhost:3000/mascotas/nombreUsuario`)
        const body = await results.json();

        body.forEach(mascota=>{
            crearMascotaFila(mascota)
        })

    } catch (error) {
        console.error(error)
    }
    function crearMascotaFila(mascota){
        const newMascota = plantilla.cloneNode(true)

        const NombreCLiente = newMascota.querySelector(".Valor-Tabla__NombreCliente")
        const NombreMascota = newMascota.querySelector(".Valor-Tabla__Mascota")
        const Nacimiento = newMascota.querySelector(".Valor-Tabla__Nacimiento")
        const Especie = newMascota.querySelector(".Valor-Tabla__Especie")
        const Sexo = newMascota.querySelector(".Valor-Tabla__Sexo")
        const color = newMascota.querySelector(".Valor-Tabla__Color")

        NombreCLiente.innerText = `${mascota.nombre_cliente} ${mascota.apellido}`
        NombreMascota.innerText = mascota.nombre_mascota
        Nacimiento.innerText = mascota.fecha_nacimiento
        Especie.innerText = mascota.especie
        if(mascota.sexo == "M"){
            Sexo.innerText = "Macho"
        }else{
            Sexo.innerText = "Hembra"
        }

        color.innerText = mascota.color

        newMascota.style.display = "table-row"
        contenedor.appendChild(newMascota)

    }
}

