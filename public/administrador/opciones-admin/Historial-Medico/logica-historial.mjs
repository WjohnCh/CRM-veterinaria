
const modalDeCarga = document.getElementById("loading-screen")
export async function VisualizarHistorialMedico(){
    let idMascota = localStorage.getItem("idMascota")
    const tablaFilaVacuna = document.getElementById("contenedor-tablaFila-vacunacion-HM")
    const PlantillaFilaVacuna = document.querySelector(".plantilla-fila-vacunacion-HM")


    // LOGICA PARA VER LOS DATOS DEL PROPIETARIO Y MASCOTA
    const nombresApellidosCliente = document.getElementById("Nombre_Cliente_Historial_Medico");
    const direccionCliente = document.getElementById("Direccion_Cliente_Historial_Medico");
    const telefonoCliente = document.getElementById("Telefono_Cliente_Historial_Medico");
    const nombreMascota = document.getElementById("Nombre_Mascota_Historial_Medico");
    const especieMascota = document.getElementById("Especie_Mascota_Historial_Medico");
    const razaMascota = document.getElementById("Raza_Mascota_Historial_Medico");
    const colorMascota = document.getElementById("Color_Mascota_Historial_Medico");
    const sexoMascota = document.getElementById("Sexo_Mascota_Historial_Medico");
    const nacimientoMascota = document.getElementById("Nacimiento_Mascota_Historial_Medico");
    const obsMascota = document.getElementById("obs_Mascota_Historial_Medico");
    await verDatosClienteYmascota()
    async function verDatosClienteYmascota(){
        try {
            modalDeCarga.style.display = "flex";

            const result = await fetch(`http://localhost:3000/obtenerdatocliente/mascota/${idMascota}`);
                 
            const { mascota } = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            nombreMascota.innerText = mascota.nombre_mascota
            especieMascota.innerText = mascota.especie
            razaMascota.innerText = mascota.raza
            colorMascota.innerText = mascota.color
            if(mascota.sexo =="M"){
                sexoMascota.innerText = "Macho"
            }else{
                sexoMascota.innerText = "Hembra"
            }
            nacimientoMascota.innerText = mascota.fecha_nacimiento
            obsMascota.innerText = mascota.obs            
        } catch (error){
            console.error(error)
        }
    }

    await verDatosCliente()
    async function verDatosCliente(){
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/obtenerdatocliente/mascota/${idMascota}`)
            const {cliente} = await result.json();
            
            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }
            

            nombresApellidosCliente.innerText = cliente.nombre_cliente + " "+cliente.apellido
            direccionCliente.innerText = cliente.direccion
            telefonoCliente.innerText = cliente.telefono          
        } catch (error){
            console.error(error)
        }
    }
    // LOGICA PARA VER VACUNAS

    await VerVacunas()
    async function VerVacunas(){
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/vacunas/${idMascota}`)
            const body = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            tablaFilaVacuna.innerText = ""
            body.forEach(vacuna=>{
                CrearFIlaVacuna(vacuna)
            })
        } catch (error) {
            console.error(error)
        }
    }

    function CrearFIlaVacuna(vacuna){
        const newVacuna = PlantillaFilaVacuna.cloneNode(true);

        const FechaVacuna = newVacuna.querySelector(".celda-vacunacion_fecha")
        const TipoVacuna = newVacuna.querySelector(".celda-vacunacion_Vacuna")
        const TemperaturaVacuna = newVacuna.querySelector(".celda-vacunacion_Tipo")
        const PesoVacuna = newVacuna.querySelector(".celda-vacunacion_Peso")

        FechaVacuna.innerText = vacuna.fecha
        TipoVacuna.innerText = vacuna.tipoVacunacion
        if(vacuna.temperatura){
            TemperaturaVacuna.innerText = `${vacuna.temperatura}`
        }
        if(vacuna.peso){
            PesoVacuna.innerText = `${vacuna.peso}kg`
        }
        newVacuna.style.display = "table-row";
        tablaFilaVacuna.appendChild(newVacuna)
    }

// LOGICA PARA VER LAS DESPARACITACIONES

    const plantillaDespartacitacion = document.querySelector(".Plantilla-desparacitacion-HM")
    const contenedorDesparacitacion = document.getElementById("Contenedor-desparacitacion-tabla-HM")

    await verDesparacitacion()
    
    async function verDesparacitacion(){
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/desparacitaciones/${idMascota}`)
            const body = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            contenedorDesparacitacion.innerText = ""
            body.forEach(desparacitacion=>{
                CrearFIlaDesparacitacion(desparacitacion)
            })
        } catch (error) {
            console.error(error)
        }
    }

    function CrearFIlaDesparacitacion(desparacitacion){
        const newDesparacitacion = plantillaDespartacitacion.cloneNode(true)

        const FechaDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_fecha")
        const ProductoDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_Producto")
        const PesoDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_Peso")

        FechaDesparacitacion.innerText = desparacitacion.fecha
        ProductoDesparacitacion.innerText = desparacitacion.producto
        if(desparacitacion.peso){
            PesoDesparacitacion.innerText = `${desparacitacion.peso}kg`
        }

        newDesparacitacion.style.display = "table-row";
        contenedorDesparacitacion.appendChild(newDesparacitacion)
    }

    // VER LA HISTORIA CLINICA
    const ContenedorHistoriaClinica = document.getElementById("Contenedor-historias-clinicas")
    const PlantillaHistoriaClinica = document.querySelector(".Contenido-HistoriaClínica-HM")

    await verHistoriaClinica()

    async function verHistoriaClinica(){
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/revisionmedica/${idMascota}`)
            const body = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            ContenedorHistoriaClinica.innerText = ""
            body.forEach(historia=>{
                CrearFilaHistoriaClinica(historia)
            })
            
        } catch (error) {
            console.error(error)
        }
    }

    function CrearFilaHistoriaClinica(historia){
        const newHistoria = PlantillaHistoriaClinica.cloneNode(true);

        const fecha = newHistoria.querySelector(".Fecha_historiaClinica_Historial_Medico")
        const temperatura = newHistoria.querySelector(".Temperatura_historiaClinica_Historial_Medico")
        const frecuenciaCardiaca = newHistoria.querySelector(".FrecuenciaCardiaca_historiaClinica_Historial_Medico")
        const frecuencaRespiratoria = newHistoria.querySelector(".FrecuenciaRespiratoria_historiaClinica_Historial_Medico")
        const peso = newHistoria.querySelector(".Peso_historiaClinica_Historial_Medico")
        const mucosas = newHistoria.querySelector(".Mucosas_historiaClinica_Historial_Medico")
        const glucosa = newHistoria.querySelector(".Glucosa_historiaClinica_Historial_Medico")
        const TLC = newHistoria.querySelector(".TLC_historiaClinica_Historial_Medico")
        const anamesis = newHistoria.querySelector(".Anamnesis_historiaClinica_Historial_Medico")
        const diagnosticoPresuntivo = newHistoria.querySelector(".DiagnosticoPresuntivo_historiaClinica_Historial_Medico")
        const tratamiento = newHistoria.querySelector(".Tratamiento_historiaClinica_Historial_Medico")
        const receta = newHistoria.querySelector(".Receta_historiaClinica_Historial_Medico")

        fecha.innerText = historia.fecha
        temperatura.innerText = historia.temperatura
        frecuenciaCardiaca.innerText = historia.frecuenciaCardiaca
        frecuencaRespiratoria.innerText = historia.frecuenciaRespiratoria
        peso.innerText = historia.peso
        mucosas.innerText = historia.mucosas
        glucosa.innerText = historia.glucosa
        TLC.innerText = historia.TLC
        anamesis.innerText = historia.anamesis
        diagnosticoPresuntivo.innerText = historia.diagnosticoPresuntivo
        tratamiento.innerText = historia.tratamiento
        receta.innerText = historia.receta

        newHistoria.style.display ="flex"
        ContenedorHistoriaClinica.appendChild(newHistoria)
    }


// --------------------------------------------------------------------------------------------------
// -----------------------------------------LOGICA PARA ACTUALIZAR-----------------------------------
// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
    const btnmascota = document.getElementById("actualizar_mascota-HM")
    const btnpropietario = document.getElementById("actualizar_propietario-HM")
    const btnvacuna = document.getElementById("Aniadir_vacunacion-HM")
    const btndesparacitacion = document.getElementById("aniadirDesparacitacion-HM")
    const btnhistoria = document.getElementById("Aniadir-historiaClinica-HM")

    const modalActualizarMascota = document.getElementById("Modal-aniadirNuevaMascota")
    const modalActualizarCliente = document.getElementById("contenedor-principal-micuenta-cliente")
    const modalVacunacion = document.getElementById("modal-AniadirVacunas-HM")
    const modalDesparacitacion = document.getElementById("modal-AniadirDesparacitaciones-HM")
    const modalAniadirHistoriaClinica = document.getElementById("modalAniadirHistoriaClinica")

    const equis = document.querySelectorAll(".modal-generico");
    equis.forEach(element => {
        const equisCerrar = element.querySelector(".equis-ubicacion")
        if (equisCerrar) {
            equisCerrar.addEventListener("click", () => {
                element.style.display = "none";
            })
        }

        element.addEventListener("click", (event) => {
            if (event.target == element) {
                element.style.display = "none";
            }
        })
    })


    const nombreMascotaActualizar = document.getElementById("nombre_mascota-aniadorFRM")
    const colorMascotaActualizar = document.getElementById("color_mascota-aniadorFRM")
    const razaMascotaActualizar = document.getElementById("raza_mascota-aniadorFRM")
    const sexoMascotaActualizar = document.getElementById("sexo_mascota-aniadorFRM")
    const especieMascotaActualizar = document.getElementById("especie_mascota-aniadorFRM")
    const obsMascotaActualizar = document.getElementById("informacion_mascota-aniadorFRM")
    const nacimientoMascotaActualizar = document.getElementById("fechaNacimiento_mascota-aniadorFRM")

    btnmascota.addEventListener("click", async()=>{
        modalActualizarMascota.style.display = "grid"
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/obtenerdatocliente/mascota/${idMascota}`)
            const {mascota} = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            nombreMascotaActualizar.value = mascota.nombre_mascota
            if(mascota.especie == "Perro" ||mascota.especie == "perro" ){
                especieMascotaActualizar.value = "perro"
            }else{
                especieMascotaActualizar.value = "gato"
            }
            razaMascotaActualizar.value = mascota.raza
            colorMascotaActualizar.value = mascota.color
            if(mascota.sexo == "M"){
                sexoMascotaActualizar.value = "M"
            }else{
                sexoMascotaActualizar.value = "H"
            }
            obsMascotaActualizar.value = mascota.obs
            nacimientoMascotaActualizar.value = mascota.fecha_nacimiento
        } catch (error) {
            console.error(error);
        }
    })


    const nombrePropietarioActualizar = document.getElementById("input_miCuenta_Nombres")
    const nombreApellido = document.getElementById("input_miCuenta_Apellidos")
    const TelefonopietarioActualizar = document.getElementById("input_miCuenta_telefono")
    const DireccionPropietarioActualizar = document.getElementById("input_miCuenta_email")

    btnpropietario.addEventListener("click", async()=>{
        modalActualizarCliente.style.display = "grid"
        try {
            modalDeCarga.style.display = "flex";
            const result = await fetch(`http://localhost:3000/obtenerdatocliente/mascota/${idMascota}`)
            const {cliente} = await result.json();

            if(result.ok){
                //CARGAR MODAL DE ACEPTAR
                modalDeCarga.style.display = "none";
            }else{
                //CARGAR MODAL DE ERROR
            }

            nombrePropietarioActualizar.value = cliente.nombre_cliente
            nombreApellido.value = cliente.apellido
            TelefonopietarioActualizar.value = cliente.telefono
            DireccionPropietarioActualizar.value = cliente.direccion
        } catch (error) {
            console.error(error);
        }
    })
    btnvacuna.addEventListener("click", ()=>{
        modalVacunacion.style.display = "grid"
    })
    btndesparacitacion.addEventListener("click", ()=>{
        modalDesparacitacion.style.display = "grid"
    })
    btnhistoria.addEventListener("click", ()=>{
        modalAniadirHistoriaClinica.style.display = "grid"
    })



    const frmActualizarMascota = document.getElementById("Formulario_AniadirMascota")

    frmActualizarMascota.addEventListener("submit", async(event)=>{
        event.preventDefault();
        const formData = new FormData(frmActualizarMascota);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/mascota/update/${idMascota}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                modalActualizarMascota.style.display = "none"
                await verDatosClienteYmascota()
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    })

    const frmActualizarCliente = document.getElementById("frm-micuenta-usuario")
    frmActualizarCliente.addEventListener("submit", async(event)=>{
        event.preventDefault();
        const formData = new FormData(frmActualizarCliente);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/usuario/update/${idMascota}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                modalActualizarCliente.style.display = "none"
                await verDatosCliente()
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    })

    const frmAniadirVacuna = document.getElementById("frmAniadirnewVacuna-HM1")
    frmAniadirVacuna.addEventListener("submit", async(event)=>{
        event.preventDefault();
        const formData = new FormData(frmAniadirVacuna);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
        });

        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/vacuna/aniadir/${idMascota}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmAniadirVacuna.reset();
                modalVacunacion.style.display = "none"
                await VerVacunas();
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }

    })

    const frmDesparacitaciones = document.getElementById("AniadirDesparacitaciones-HM")

    frmDesparacitaciones.addEventListener("submit", async(event)=>{
        event.preventDefault();
        const formData = new FormData(frmDesparacitaciones);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.trim();
            if(value == ''){
                value = null
            }
        });

        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/desparasitacion/aniadir/${idMascota}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmDesparacitaciones.reset();
                modalDesparacitacion.style.display = "none"
                await verDesparacitacion()
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    })

    const frmHistoriaClinica = document.getElementById("AniadirHistoriaClinica");
    frmHistoriaClinica.addEventListener("submit", async(event)=>{
        event.preventDefault();
        const formData = new FormData(frmHistoriaClinica);
        const data = {};
        formData.forEach((value, key) => {
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
        });
        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/revmed/aniadir/${idMascota}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmDesparacitaciones.reset();
                modalAniadirHistoriaClinica.style.display = "none"
                await verHistoriaClinica()
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    })
}




export async function VisualizarTablaHistorialMedico(){
    const contenedor = document.getElementById("Cuerpo_tabla-Gestion-Producto")
    const plantilla = document.querySelector(".Fila_producto")

    try {
        modalDeCarga.style.display = "flex";
        const results = await fetch(`http://localhost:3000/historialMedico`)
        const body = await results.json();

        if(results.ok){
            //CARGAR MODAL DE ACEPTAR
            modalDeCarga.style.display = "none";
        }else{
            //CARGAR MODAL DE ERROR
        }

        body.forEach(async (hmedico)=>{
            crearHistorialMedicoFila(hmedico)
        })
        

    } catch (error) {
        console.error(error)
    }

    function crearHistorialMedicoFila(hmedico){
        const newHistorial = plantilla.cloneNode(true)

        const idHistorial = newHistorial.querySelector(".Valor-Tabla__NombreSesion")
        const nombreCliente = newHistorial.querySelector(".Valor-Tabla__nombreCliente")
        const mascota = newHistorial.querySelector(".Valor-Tabla__Mascota")
        const sexo = newHistorial.querySelector(".Valor-Tabla__sexo")
        const especie = newHistorial.querySelector(".Valor-Tabla__Especie")
        const detalle = newHistorial.querySelector(".Valor-Tabla__detalles")
        const raza = newHistorial.querySelector(".Valor-Tabla__raza")

        idHistorial.innerText = hmedico.idHistorialMedico
        nombreCliente.innerText = `${hmedico.nombre_cliente} ${hmedico.apellido}`
        mascota.innerText = hmedico.nombre_mascota
        if(hmedico.sexo == "M"){
            sexo.innerText = "Macho"
        }else{
            sexo.innerText = "Hembra"
        }
        especie.innerText = hmedico.especie
        raza.innerText = hmedico.raza
        detalle.addEventListener("click", async()=>{
            localStorage.setItem('idMascota', hmedico.idmascota);
            await CargarContenido("Historial-Medico/plantilla-historial.html")
            await VisualizarHistorialMedico();
        })

        newHistorial.style.display = "table-row"
        contenedor.appendChild(newHistorial)
    }

    let contenedorDinamico = document.getElementById("contenedor-main-admin")

    async function CargarContenido(url){
        try {
            modalDeCarga.style.display = "flex";
            let respuesta = await fetch(`/public/administrador/opciones-admin/${url}`);
            if (!respuesta.ok){
                throw new Error('Error al cargar los datos');
            }else{
                modalDeCarga.style.display = "none";
            }
            let contenido = await respuesta.text();
            contenedorDinamico.innerHTML = contenido
        } catch (error) {
            console.error('Error:', error);
        }
    }


    // ----------------------------------------------------------------------
    // ------------------LOGICA PARA FILTRAR EL HISTORIAL MEDICO-------------
    // ----------------------------------------------------------------------

    const btnFiltro = document.getElementById("btn-buscar-filtro-historialMedico");
    
    const inputValorMascota = document.getElementById("Nombre_Mascota-gestionUsuario-filtro")
    const inputValorCliente = document.getElementById("Nombre_Cliente-gestionUsuario-filtro")

    btnFiltro.addEventListener("click", async ()=>{
        let NombreCLiente = inputValorCliente.value.trim();
        let NombreMascota = inputValorMascota.value.trim();

        console.log(NombreCLiente, NombreMascota);
        if(!NombreCLiente){
            NombreCLiente = 'null'
        }
        if(!NombreMascota){
            NombreMascota = 'null'
        }
        try {
            modalDeCarga.style.display = "flex";
            contenedor.innerText = ""
            const result = await fetch(`http://localhost:3000/clientes/historial/${NombreMascota}/${NombreCLiente}`)
            const body = await result.json()

            if(result.ok){
                modalDeCarga.style.display = "none";
                body.forEach(async (coincidencias)=>{
                    crearHistorialMedicoFila(coincidencias)
                })
            }else{
                modalDeCarga.style.display = "none";
                alert("OCURRIO UN ERROR, VUELVA A INTENTARLO")
            }
            

            
        } catch (error) {
            console.error("Hay un error: ", error)
        }
    })

}