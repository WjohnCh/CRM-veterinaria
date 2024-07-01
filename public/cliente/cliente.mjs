document.addEventListener("DOMContentLoaded",async ()=>{
    const imgUser = document.getElementById("cliente-img user")
    const cerrarModalOpcionesAdmin = document.getElementById("modal-opcion-cliente-logout")
    const nombreUsuario = document.getElementById("nombreUser-token")
    
    const token = localStorage.getItem('token');

    imgUser.addEventListener("click", ()=>{
        cerrarModalOpcionesAdmin.classList.toggle("motrar-elemento");
    })

    document.addEventListener("click", (event)=>{
        if(event.target != cerrarModalOpcionesAdmin && event.target != imgUser){
            cerrarModalOpcionesAdmin.classList.remove("motrar-elemento");
        }
    })
    


    try {
        const response = await fetch('http://localhost:3000/user-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        const {nombre} = await response.json();
        nombreUsuario.innerText= nombre
    } catch (error) {
        
    }


    const btnSalirCliente = document.getElementById("botonSalir-cliente")
    btnSalirCliente.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.href = '../navbar.html'
    })

})