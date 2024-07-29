
const modalDeCarga = document.getElementById("loading-screen")
export async function VisualizarHistorialMedico(){
    let idMascota = localStorage.getItem("idMascota")
    const tablaFilaVacuna = document.getElementById("contenedor-tablaFila-vacunacion-HM")
    const PlantillaFilaVacuna = document.querySelector(".plantilla-fila-vacunacion-HM")


    // LOGICA PARA VER LOS DATOS DEL PROPIETARIO Y MASCOTA
    const nombresApellidosCliente = document.getElementById("Nombre_Cliente_Historial_Medico");
    const direccionCliente = document.getElementById("Direccion_Cliente_Historial_Medico");
    const telefonoCliente = document.getElementById("Telefono_Cliente_Historial_Medico");
    const correoCliente = document.getElementById("correo_Cliente_Historial_Medico");
    const nombreMascota = document.getElementById("Nombre_Mascota_Historial_Medico");
    const especieMascota = document.getElementById("Especie_Mascota_Historial_Medico");
    const razaMascota = document.getElementById("Raza_Mascota_Historial_Medico");
    const colorMascota = document.getElementById("Color_Mascota_Historial_Medico");
    const sexoMascota = document.getElementById("Sexo_Mascota_Historial_Medico");
    const nacimientoMascota = document.getElementById("Nacimiento_Mascota_Historial_Medico");
    const obsMascota = document.getElementById("obs_Mascota_Historial_Medico");

    const modalActualizarVacuna = document.getElementById("modal-ActualizarVacuna-HM")
    const actualizarFecha = document.getElementById("actVacuna_fecha");
    const actualizarTipoVacunacion = document.getElementById("actVacuna_tipoVacunacion");
    const actualizarTemperatura = document.getElementById("actVacuna_temperatura");
    const actualizarPeso = document.getElementById("actVacuna_peso");
    const actualizarProxvacu = document.getElementById("actVacuna_proxvacu");
    const actualizarFC = document.getElementById("actVacuna_FC");
    const actualizarFR = document.getElementById("actVacuna_FR");

    const advertenciaVacuna = document.getElementById("Modal-InterfazAdvertenciaVacunas")
    const btnadvertenciaVacuna = document.getElementById("btn-InterfazAdvertenciaVacunas")
    let guardarIDvacuna;

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
                modalDeCarga.style.display = "none";
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
            modalDeCarga.style.display = "none";
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
                modalDeCarga.style.display = "none";
                //CARGAR MODAL DE ERROR
            }
            
            nombresApellidosCliente.innerText = cliente.nombre_cliente + " "+cliente.apellido
            direccionCliente.innerText = cliente.direccion
            telefonoCliente.innerText = cliente.telefono          
            correoCliente.innerText = cliente.correo          
        } catch (error){
            modalDeCarga.style.display = "none";
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
        const FC = newVacuna.querySelector(".celda-vacunacion_FC")
        const FR = newVacuna.querySelector(".celda-vacunacion_FR")
        const ProxFecha = newVacuna.querySelector(".celda-vacunacion_ProxFecha")

        const EditarVacuna = newVacuna.querySelector(".celda-vacunacion_editar")
        const BorrarVacuna = newVacuna.querySelector(".celda-vacunacion_borrar")

        FechaVacuna.innerText = vacuna.fecha
        TipoVacuna.innerText = vacuna.tipoVacunacion
        if(vacuna.temperatura){
            TemperaturaVacuna.innerText = `${vacuna.temperatura} °C`
        }
        if(vacuna.peso){
            PesoVacuna.innerText = `${vacuna.peso} kg`
        }
        if(vacuna.vac_frecuenciaCardiaca){
            FC.innerText = `${vacuna.vac_frecuenciaCardiaca} lpm`
        }
        if(vacuna.vac_frecuenciaRespiratoria){
            FR.innerText = `${vacuna.vac_frecuenciaRespiratoria} rpm`
        }
        if(vacuna.prox_fecha){
            ProxFecha.innerText = `${vacuna.prox_fecha}`
        }
        EditarVacuna.addEventListener("click", async ()=>{
            modalActualizarVacuna.style.display = "grid"
            modalDeCarga.style.display = "flex";
            try {
                const result = await fetch(`http://localhost:3000/vacuna/unasola/${vacuna.idVacuna}`)
                const [{fecha, peso, prox_fecha, temperatura, tipoVacunacion, vac_frecuenciaCardiaca, vac_frecuenciaRespiratoria}] = await result.json();
                
                if (result.ok) {
                    guardarIDvacuna = vacuna.idVacuna;
                    modalDeCarga.style.display = "none";
                    setValueIfExists(actualizarFecha, fecha);
                    setValueIfExists(actualizarTipoVacunacion, tipoVacunacion);
                    setValueIfExists(actualizarTemperatura, temperatura);
                    setValueIfExists(actualizarPeso, peso);
                    setValueIfExists(actualizarProxvacu, prox_fecha);
                    setValueIfExists(actualizarFC, vac_frecuenciaCardiaca);
                    setValueIfExists(actualizarFR, vac_frecuenciaRespiratoria);
                }else{
                    modalDeCarga.style.display = "none"
                }

            } catch (error) {
                modalDeCarga.style.display = "none"
                console.error(error);
            }

        })

        BorrarVacuna.addEventListener("click", async ()=>{
            advertenciaVacuna.style.display = "grid"
            guardarIDvacuna = vacuna.idVacuna;
            btnadvertenciaVacuna.onclick = borrarVacuna
        })

        async function borrarVacuna(){
            try {
                modalDeCarga.style.display = "grid";
                const response = await fetch(`http://localhost:3000/vacuna/eliminar/${guardarIDvacuna}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok){
                    modalDeCarga.style.display = "none";
                    advertenciaVacuna.style.display = "none"
                    await VerVacunas()
                } else {
                    modalDeCarga.style.display = "none";
                    throw new Error('Error al eliminar la vacuna');
                }
            } catch (error) {
                modalDeCarga.style.display = "none";
                console.error(error);
            }
        }

        newVacuna.style.display = "table-row";
        tablaFilaVacuna.appendChild(newVacuna)
    }

    // REUTILIZAR PARA DESPARASITACIONES
    function setValueIfExists(element, value) {
        element.value = value !== null ? value : '';
    }

// LOGICA PARA VER LAS DESPARACITACIONES

    const plantillaDespartacitacion = document.querySelector(".Plantilla-desparacitacion-HM")
    const contenedorDesparacitacion = document.getElementById("Contenedor-desparacitacion-tabla-HM")

    const modalEditarDesparacitacion = document.getElementById("modal-EditarDesparacitacion-HM") 
    const frmEditarDesparacitacion = document.getElementById("EditarDesparacitacion-HM") 
    const inputdesparaActufecha = document.getElementById("actualiDespara_fecha")
    const inputdesparaActuproducto = document.getElementById("actualiDespara_producto")
    const inputdesparaActupeso = document.getElementById("actualiDespara_peso")
    const inputdesparaActuDosis = document.getElementById("actualiDespara_dosis")
    const inputdesparaActutipo = document.getElementById("actualiDespara_tipo")
    const inputdesparaActuProxFecha = document.getElementById("actualiDespara_proxfecha")

    const btnActualiDesparacitacion = document.getElementById("btnActualizarDesparacitacion")
    let idDesparasitacion;

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

    function CrearFIlaDesparacitacion(desparasitacion){
        const newDesparacitacion = plantillaDespartacitacion.cloneNode(true)

        const FechaDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_fecha");
        const ProductoDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_Producto");
        const PesoDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_Peso");
        const DosisDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_Dosis");
        const TipoDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_tipo");
        const ProxFechaDesparacitacion = newDesparacitacion.querySelector(".celda-despacitacion_proxFecha");
        const EditarDesparacitacion = newDesparacitacion.querySelector(".celda-vacunacion_editar");
        const BorrarDesparacitacion = newDesparacitacion.querySelector(".celda-vacunacion_borrar");


        FechaDesparacitacion.innerText = desparasitacion.fecha
        ProductoDesparacitacion.innerText = desparasitacion.producto

        if(desparasitacion.peso){
            PesoDesparacitacion.innerText = `${desparasitacion.peso} kg`
        }
        if(desparasitacion.dosis) {
            DosisDesparacitacion.innerText = desparasitacion.dosis;
        }
        if(desparasitacion.tipo) {
            TipoDesparacitacion.innerText = desparasitacion.tipo;
        }
        if(desparasitacion.prox_fecha) {
            ProxFechaDesparacitacion.innerText = desparasitacion.prox_fecha;
        }

        EditarDesparacitacion.addEventListener("click", async ()=>{
            modalEditarDesparacitacion.style.display = "grid"
            modalDeCarga.style.display = "flex";
            try {
                const result = await fetch(`http://localhost:3000/desparasitacion/mascota/${desparasitacion.idDesparasitacion}`)
                const {fecha, peso, prox_fecha, producto, dosis, tipo} = await result.json();
                
                if (result.ok) {
                    modalDeCarga.style.display = "none";
                    setValueIfExists(inputdesparaActufecha, fecha);
                    setValueIfExists(inputdesparaActuproducto, producto);
                    setValueIfExists(inputdesparaActupeso, peso);
                    setValueIfExists(inputdesparaActuDosis, dosis);
                    if (tipo === "Interna") {
                        inputdesparaActutipo.value = "Interna";
                    } else if (tipo === "Externa") {
                        inputdesparaActutipo.value = "Externa";
                    } else {
                        inputdesparaActutipo.value = "";
                    }
                    setValueIfExists(inputdesparaActuProxFecha, prox_fecha);
                }else{
                    modalDeCarga.style.display = "none"
                }

                idDesparasitacion = desparasitacion.idDesparasitacion;
            } catch (error) {
                modalDeCarga.style.display = "none"
                console.error(error);
            }

        })

        BorrarDesparacitacion.addEventListener("click", async ()=>{
            advertenciaVacuna.style.display = "grid"
            btnadvertenciaVacuna.onclick = borrarDesparasitacion
        })

        async function borrarDesparasitacion(){
            try {
                modalDeCarga.style.display = "grid";
                const response = await fetch(`http://localhost:3000/desparasitacion/eliminar/${desparasitacion.idDesparasitacion}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok){
                    modalDeCarga.style.display = "none";
                    advertenciaVacuna.style.display = "none"
                    await verDesparacitacion()
                } else {
                    modalDeCarga.style.display = "none";
                    throw new Error('Error al eliminar la vacuna');
                }
            } catch (error) {
                modalDeCarga.style.display = "none";
                console.error(error);
            }
        }
        newDesparacitacion.style.display = "table-row";
        contenedorDesparacitacion.appendChild(newDesparacitacion)
    }

    // VER LA HISTORIA CLINICA
    const ContenedorHistoriaClinica = document.getElementById("Contenedor-historias-clinicas")
    const PlantillaHistoriaClinica = document.querySelector(".Contenido-HistoriaClínica-HM")

    const inputActuHMFecha = document.getElementById("Actualihistoriaclinica_fecha");
    const inputActuHMTemperatura = document.getElementById("Actualihistoriaclinica_t");
    const inputActuHMFrecuenciaCardiaca = document.getElementById("Actualihistoriaclinica_fc");
    const inputActuHMFrecuenciaRespiratoria = document.getElementById("Actualihistoriaclinica_fr");
    const inputActuHMPeso = document.getElementById("Actualihistoriaclinica_peso");
    const inputActuHMTLC = document.getElementById("Actualihistoriaclinica_tlc");
    const inputActuHMGlucosa = document.getElementById("Actualihistoriaclinica_glucosa");
    const inputActuHMMucosas = document.getElementById("Actualihistoriaclinica_Mucosas");
    const inputActuHMDiagnosticoPresuntivo = document.getElementById("Actualihistoriaclinica_diagnostico");
    const inputActuHMAnamnesis = document.getElementById("Actualihistoriaclinica_anamnesis");
    const inputActuHMExamRealizados = document.getElementById("Actualihistoriaclinica_examanes"); // Corregido el name
    const inputActuHMTratamiento = document.getElementById("Actualihistoriaclinica_tratamiento");
    const inputActuHMReceta = document.getElementById("Actualihistoriaclinica_receta");

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
                modalDeCarga.style.display = "none";
                //CARGAR MODAL DE ERROR
            }

            ContenedorHistoriaClinica.innerText = ""
            body.forEach(historia=>{
                CrearFilaHistoriaClinica(historia)
            })
            
        } catch (error) {
            modalDeCarga.style.display = "none";
            console.error(error)
        }
    }

    const modalActualizarHistorial = document.getElementById("modalActualizarHistoriaClinica")
    const frmActualizarHistorial = document.getElementById("ActualizarHistoriaClinica")
    let revisionMedica;


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
        const ExamenRealizado = newHistoria.querySelector(".ExamenRealizado_historiaClinica_Historial_Medico")
        
        const btnEditar = newHistoria.querySelector(".btnEditar_HM")
        const btnBorrar = newHistoria.querySelector(".btnBorrar_HM")
    

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
        ExamenRealizado.innerText = historia.examenes_realizados || null

        btnEditar.addEventListener("click", async ()=>{
            modalActualizarHistorial.style.display = "grid"
            modalDeCarga.style.display = "flex";
            try {
                const result = await fetch(`http://localhost:3000/revisionmedica/unica/${historia.idRevisionMedica}`)
                const {fecha, temperatura, frecuenciaCardiaca, frecuenciaRespiratoria, peso, mucosas, glucosa, TLC,
                    anamesis, diagnosticoPresuntivo, tratamiento, receta, examenes_realizados,
                } = await result.json();

                if (result.ok) {
                    modalDeCarga.style.display = "none";
                    setValueIfExists(inputActuHMFecha, fecha);
                    setValueIfExists(inputActuHMTemperatura, temperatura);
                    setValueIfExists(inputActuHMFrecuenciaCardiaca, frecuenciaCardiaca);
                    setValueIfExists(inputActuHMFrecuenciaRespiratoria, frecuenciaRespiratoria);
                    setValueIfExists(inputActuHMPeso, peso);
                    setValueIfExists(inputActuHMMucosas, mucosas);
                    setValueIfExists(inputActuHMGlucosa, glucosa);
                    setValueIfExists(inputActuHMTLC, TLC);
                    setValueIfExists(inputActuHMAnamnesis, anamesis);
                    setValueIfExists(inputActuHMDiagnosticoPresuntivo, diagnosticoPresuntivo);
                    setValueIfExists(inputActuHMTratamiento, tratamiento);
                    setValueIfExists(inputActuHMReceta, receta);
                    setValueIfExists(inputActuHMExamRealizados, examenes_realizados);
                }else{
                    modalDeCarga.style.display = "none"
                }
                revisionMedica = historia.idRevisionMedica;
            } catch (error) {
                modalDeCarga.style.display = "none"
                console.error(error);
            }

        })

        btnBorrar.addEventListener("click", async ()=>{
            advertenciaVacuna.style.display = "grid"
            btnadvertenciaVacuna.onclick = borrarDesparasitacion
        })

        async function borrarDesparasitacion(){
            try {
                modalDeCarga.style.display = "grid";
                const response = await fetch(`http://localhost:3000/revisionmedica/eliminar/${historia.idRevisionMedica}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok){
                    modalDeCarga.style.display = "none";
                    advertenciaVacuna.style.display = "none"
                    await verHistoriaClinica()
                } else {
                    modalDeCarga.style.display = "none";
                    throw new Error('Error al eliminar la vacuna');
                }
            } catch (error) {
                modalDeCarga.style.display = "none";
                console.error(error);
            }
        }

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
        const equisCerrar = element.querySelector(".equis-ubicacion");
        if (equisCerrar) {
            equisCerrar.addEventListener("click", () => {
                element.style.display = "none";
            });
        }
        element.addEventListener("mousedown", (event) => {

            if (event.target == element) {
                element.style.display = "none";
            }
        });
    
    });


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
    const correoPropietarioActualizar = document.getElementById("input_miCuenta_correo")

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
            correoPropietarioActualizar.value = cliente.correo
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
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
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
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
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
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
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
                frmHistoriaClinica.reset()
                modalAniadirHistoriaClinica.style.display = "none"
                await verHistoriaClinica()
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    })

    const frmActualizarVacuna = document.getElementById("frmActualizarVacuna-HM1")
    frmActualizarVacuna.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = new FormData(frmActualizarVacuna);
        const data = {};
        formData.forEach((value, key) => {
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
        });
        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/vacuna/actualizar/${guardarIDvacuna}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmActualizarVacuna.reset()
                modalActualizarVacuna.style.display = "none"
                await VerVacunas()
            } else {
                modalDeCarga.style.display = "none";
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            throw new Error('Error al actualizar el producto');
        }
    })

    frmEditarDesparacitacion.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = new FormData(frmEditarDesparacitacion);
        const data = {};
        formData.forEach((value, key) => {
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
        });
        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/actualizar/desparasitacion/mascota/${idDesparasitacion}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmEditarDesparacitacion.reset()
                modalEditarDesparacitacion.style.display = "none"
                await verDesparacitacion()
            } else {
                modalDeCarga.style.display = "none";
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
            throw new Error('Error al actualizar el producto');
        }
    })

    frmActualizarHistorial.addEventListener("submit", async (event)=>{
        event.preventDefault();
        const formData = new FormData(frmActualizarHistorial);
        const data = {};
        formData.forEach((value, key) => {
            const trimmedValue = value.trim();
            data[key] = trimmedValue === '' ? null : trimmedValue;
        });
        try {
            modalDeCarga.style.display = "flex";
            const response = await fetch(`http://localhost:3000/revmed/actualizar/${revisionMedica}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok){
                modalDeCarga.style.display = "none";
                frmActualizarHistorial.reset()
                modalActualizarHistorial.style.display = "none"
                await verHistoriaClinica()
            } else {
                modalDeCarga.style.display = "none";
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            modalDeCarga.style.display = "none";
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