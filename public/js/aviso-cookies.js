
document.addEventListener("DOMContentLoaded", function() {
    const avisoCookies = document.getElementById('aviso-cookies');
    const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');
    const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');

    // Función para ocultar el banner de cookies
    function ocultarBannerCookies() {
        document.getElementById('aviso-cookies').style.display = 'none';
        document.getElementById('fondo-aviso-cookies').style.display = 'none';
    }

    // Verifica si las cookies ya han sido aceptadas
    if (localStorage.getItem("cookies-aceptadas")) {
        ocultarBannerCookies();
        ocultaBannerCookies();
    }

    // Listener para el botón de aceptar cookies
    botonAceptarCookies.addEventListener("click", () => {
        localStorage.setItem("cookies-aceptadas", true);
        ocultarBannerCookies();
    });

    function ocultaBannerCookies() {
        document.getElementById('overlay').style.display = 'none';
    }
    // window.addEventListener("unload", function() {
    //     localStorage.removeItem("cookies-aceptadas");
    // });
});
