const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');


cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());

    //Eliminar productos del carrito
    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();

    //cuando se selecciona procesar Compra
    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

    document.getElementById('generar-pdf').addEventListener('click', generarYEnviarPDF);

}


// Crear una instancia de jsPDF
const doc = new jsPDF();

// Obtener la fecha actual en formato dd/mm/yyyy
const fecha = new Date();
const fechaFormateada = fecha.toLocaleDateString("es-ES");

// Agregar la fecha al PDF en la parte superior derecha
doc.setFontSize(10);
doc.text(`Fecha: ${fechaFormateada}`, 150, 10); // Posición (X:150, Y:10)

// Luego, sigues generando el contenido del PDF...

async function generarYEnviarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1️⃣ Capturar datos del formulario
    const nombre = document.getElementById("nombre").value.trim() || "No especificado";
    const direccion = document.getElementById("direccion").value.trim() || "No especificado";

    // Validar que los campos no estén vacíos
    if (nombre === "No especificado" || direccion === "No especificado") {
        alert("⚠️ Por favor ingrese su nombre y su direccion completa antes de enviar.");
        return; // Salir de la función si los campos están vacíos
    }

    // Obtener la fecha actual en formato dd/mm/yyyy
    const fechaActual = new Date().toLocaleDateString("es-ES");

    // Obtener el logo como base64
    const logoImg = document.querySelector(".imagen").src;

    // Agregar el logo y la fecha al PDF
    doc.addImage(logoImg, 'PNG', 10, 10, 50, 20); // Ajusta las posiciones y el tamaño según sea necesario
    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaActual}`, 150, 10); // Posición (X:150, Y:10)

    // Agregar información del cliente
    doc.setFontSize(12);
    doc.text("Información del Cliente", 14, 40);
    doc.text(`Nombre: ${nombre}`, 14, 50);
    doc.text(`Dirección: ${direccion}`, 14, 60);

    // 2️⃣ Capturar datos de la tabla
    doc.text("Lista de Productos", 14, 80);
    const tabla = document.getElementById("lista-compra").getElementsByTagName('tbody')[0];
    const filas = tabla.getElementsByTagName('tr');
    let data = [];

    for (let i = 0; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName('td');
        if (celdas.length > 0) {
            let nombreProducto = celdas[1].textContent.trim();  
            let precio = parseFloat(celdas[2].textContent.trim()).toFixed(2);  // Formatear a 2 decimales
            let cantidad = celdas[3].querySelector("span.cantidad") ? celdas[3].querySelector("span.cantidad").textContent : "0";
            let subtotal = (parseFloat(precio) * parseFloat(cantidad)).toFixed(2);  // Subtotal con 2 decimales
    
            data.push([nombreProducto, precio, cantidad, subtotal]);
        }
    }

    doc.autoTable({
        head: [['Producto', 'Precio', 'Cantidad', 'Subtotal']],
        body: data,
        startY: 90
    });

    // 3️⃣ Capturar el subtotal, IGV y total
    let subtotal = document.getElementById("subtotal").textContent.trim() || "0.00";
    let igv = document.getElementById("igv").textContent.trim() || "0.00";
    let total = document.getElementById("total").textContent.trim() || "0.00";

    doc.text(`Subtotal: ${subtotal}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`IGV: ${igv}`, 14, doc.autoTable.previous.finalY + 20);
    doc.text(`TOTAL: ${total}`, 14, doc.autoTable.previous.finalY + 30);

    // 4️⃣ Descargar el PDF automáticamente
    const pdfFileName = "boleta_celular.pdf";
    doc.save(pdfFileName);

    // 5️⃣ Abrir WhatsApp con mensaje preescrito
    setTimeout(() => {
        const mensaje = `Hola, aquí está mi pedido:
📌*Nombre:* ${nombre}
📌*Dirección:* ${direccion}
🛒*Total a pagar:* ${total}

📎 Adjunto el PDF con el detalle.`;

        const telefonoDestino = "51948908967"; // Cambia por el número real
        const whatsappURL = `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappURL, "_blank");
    }, 2000); // Esperamos 2 segundos para que se descargue el PDF antes de abrir WhatsApp
}
