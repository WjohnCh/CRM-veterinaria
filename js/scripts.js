function aceptarCookies() {
    document.getElementById('aviso-cookies').style.display = 'none';
    document.getElementById('fondo-aviso-cookies').style.display = 'none';
    ocultaBannerCookies();
}
function rechazarCookies() {
    document.getElementById('aviso-cookies').style.display = 'none';
    document.getElementById('fondo-aviso-cookies').style.display = 'none';
    ocultaBannerCookies();
}
function cerrarBannerCookies() {
    document.getElementById('aviso-cookies').style.display = 'none';
    document.getElementById('fondo-aviso-cookies').style.display = 'none';
    ocultaBannerCookies();
}
function ocultaBannerCookies() {
    document.getElementById('overlay').style.display = 'none';
}

window.addEventListener('scroll', function() {
    var barraNavegacion = document.querySelector('.Barra-Navegacion');
    var containerInfo = document.querySelector('.Container-info');
    var scrollPos = window.scrollY;

    if (scrollPos > 0) {
        barraNavegacion.classList.add('fixed');
        containerInfo.classList.add('hide');
    } else {
        barraNavegacion.classList.remove('fixed');
        containerInfo.classList.remove('hide');
    }
});