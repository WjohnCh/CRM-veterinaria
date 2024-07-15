
export async function cargarMisdatos(){
    const btnEditarMicuenta = document.getElementById("btnEditarMicuenta")
    const NombreUser = document.getElementById("input_miCuenta_usuario")
    const ContrasenaUser = document.getElementById("input_miCuenta_contraseña")
    const NombreCompleto = document.getElementById("input_miCuenta_nombreCompleto")
    const EmailUser = document.getElementById("input_miCuenta_email")
    const TelefonoUser = document.getElementById("input_miCuenta_telefono")
    const DireccionUser = document.getElementById("input_miCuenta_direccion")
    const arrayInput = [NombreUser, ContrasenaUser,TelefonoUser,DireccionUser ]

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/datosCliente`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const cuerpo = await response.json();
        console.log(cuerpo);
        const {Contrasena, Direccion, Nombre_Completo, Nombre_Usuario, Telefono,  Email} = cuerpo
        NombreUser.value= Nombre_Usuario
        ContrasenaUser.value= Contrasena
        NombreCompleto.value= Nombre_Completo
        EmailUser.value= Email
        TelefonoUser.value= Telefono
        DireccionUser.value= Direccion
        
    } catch (error) {
        
    }


    
    const frmActualizarMisDatos = document.getElementById("frm-micuenta-usuario");


    function modificarEstado(input, valor){
        input.disabled = valor;
        input.classList.add("MiCuenta_NOdisabled_input");
    }




    btnEditarMicuenta.addEventListener("click", async ()=>{
        btnEditarMicuenta.classList.add("boton-generico-primario-Apretado");
        if(btnEditarMicuenta.classList.contains("boton-generico-primario-Apretado")){
            for(let i=0; i < arrayInput.length; i++ ){
                modificarEstado(arrayInput[i], false)
            }
            btnEditarMicuenta.innerText = "Actualizar Datos"
            btnEditarMicuenta.type = 'button'
        }
        if(btnEditarMicuenta.innerText == "Actualizar Datos"){
            btnEditarMicuenta.type = 'submit'
        }
    })

    frmActualizarMisDatos.addEventListener("submit", async(event)=>{
        event.preventDefault();

        const formData = new FormData();
        arrayInput.forEach(input => {
            formData.append(input.name, input.value.trim());
        });
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

            try {
                const response = await fetch(`http://localhost:3000/crear-mascota`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    alert("Hubo un problema al actualizar los datos")
                }else{
                    alert("Datos Guardados Correctamente")
                }
            } catch (error) {
                throw new Error('Error al actualizar el producto');
            }    
    })

}
