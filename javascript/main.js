// header cabecera //
let menuToggle = document.querySelector('.menu-toggle');
let menuToggleIcon = document.querySelector('.menu-toggle i');
let menu = document.getElementById('menu');

menuToggle.addEventListener('click', e => {
    menu.classList.toggle('show');

    if (menu.classList.contains('show')) {
        menuToggleIcon.setAttribute('class', 'fa fa-times');
    }else{
        menuToggleIcon.setAttribute('class', 'fa fa-bars');
    }
});

document.getElementById("search").addEventListener("keyup", function () {
    let searchText = this.value.toLowerCase(); // Obtener el texto en minúsculas
    let items = document.querySelectorAll(".shop-item"); // Obtener todos los elementos a buscar

    items.forEach(item => {
        let itemName = item.querySelector("h4").textContent.toLowerCase(); // Obtener el nombre del producto

        // Comprobar si el nombre incluye el texto de búsqueda
        if (itemName.includes(searchText)) {
            item.style.display = "block"; // Mostrar si coincide
        } else {
            item.style.display = "none"; // Ocultar si no coincide
        }
    });
});



function toggleCarrito() {
    let carrito = document.getElementById("container-carrito");

    carrito.classList.toggle("minimizado"); // Alterna la clase para minimizar/mostrar
}
