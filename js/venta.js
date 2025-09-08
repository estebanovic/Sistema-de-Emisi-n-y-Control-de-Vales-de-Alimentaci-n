// Espera a que la página se cargue por completo para empezar.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Poner fecha y hora automáticamente ---
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const ahora = new Date();

    // Formateamos la fecha a YYYY-MM-DD.
    const fechaFormateada = ahora.toISOString().slice(0, 10);
    // Formateamos la hora a HH:MM.
    const horaFormateada = ahora.toTimeString().slice(0, 5);
    
    // Asignamos la fecha y hora a los campos del formulario.
    fechaInput.value = fechaFormateada;
    horaInput.value = horaFormateada;

    // --- 2. Registrar el ticket en la tabla ---
    const form = document.getElementById('form-tickets');
    const tablaBody = document.querySelector('.tabla-registros tbody');

    // Esta función se ejecuta cuando haces clic en el botón "Registrar Ticket".
    form.addEventListener('submit', (event) => {
        // Evita que la página se recargue.
        event.preventDefault();

        // Obtenemos los valores de todos los campos del formulario.
        const fecha = fechaInput.value;
        const hora = horaInput.value;
        const idUsuario = document.getElementById('id').value; // Usamos el id 'id'
        const tipoTicket = document.getElementById('tipo-ticket').value;
        const itemComprado = document.getElementById('item').value; // Usamos el id 'item'
        const valor = document.getElementById('valor').value;
        
        // Creamos una nueva fila (<tr>) al final de la tabla.
        const nuevaFila = tablaBody.insertRow();

        // Creamos 6 celdas (<td>) y les ponemos el contenido correspondiente.
        nuevaFila.insertCell().textContent = fecha;
        nuevaFila.insertCell().textContent = hora;
        nuevaFila.insertCell().textContent = idUsuario;
        nuevaFila.insertCell().textContent = tipoTicket;
        nuevaFila.insertCell().textContent = itemComprado;
        // Agregamos el signo '$' al valor para que se vea mejor.
        nuevaFila.insertCell().textContent = `$${valor}`;
        
        // Limpiamos todos los campos del formulario para el siguiente registro.
        form.reset();

        // Devolvemos el cursor al campo "ID Usuario" para agilizar el próximo ingreso.
        document.getElementById('id').focus();
    });
});