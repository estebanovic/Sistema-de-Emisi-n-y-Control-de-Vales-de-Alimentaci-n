document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-servicio");
    const tablaBody = document.getElementById("tabla-servicios");
    const buscador = document.getElementById("buscador");
    const btnEliminar = document.getElementById("btn-eliminar");
    const btnExportar = document.getElementById("btn-exportar");

    let servicioEditando = null;

    // Inicializar
    cargarServicios();

    // Event listeners
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        guardarServicio();
    });

    btnEliminar.addEventListener("click", () => {
        eliminarServicio();
    });

    btnExportar.addEventListener("click", () => {
        exportarServicios();
    });

    buscador.addEventListener("input", () => {
        filtrarServicios();
    });

    function guardarServicio() {
        const id = document.getElementById("id").value;
        const nombre = document.getElementById("nombre").value;
        const inicio = document.getElementById("inicio").value;
        const fin = document.getElementById("fin").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const sede = document.getElementById("sede").value;
        const maxVales = parseInt(document.getElementById("maxVales").value);
        const activo = document.getElementById("activo").value === "true";
        const descripcion = document.getElementById("descripcion").value;

        if (!nombre || !inicio || !fin || !precio || !sede || !maxVales) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        if (inicio >= fin) {
            alert("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }

        const servicio = {
            id: id || Date.now(),
            nombre,
            inicio,
            fin,
            precio,
            sede,
            maxVales,
            activo,
            descripcion,
            fechaCreacion: new Date().toISOString()
        };

        const servicios = obtenerServicios();
        
        if (id) {
            // Editar servicio existente
            const index = servicios.findIndex(s => s.id == id);
            if (index !== -1) {
                servicios[index] = servicio;
            }
        } else {
            // Nuevo servicio
            servicios.push(servicio);
        }

        localStorage.setItem("servicios", JSON.stringify(servicios));
        form.reset();
        cargarServicios();
        servicioEditando = null;
        btnEliminar.style.display = "none";
        
        alert(id ? "Servicio actualizado correctamente." : "Servicio guardado correctamente.");
    }

    function cargarServicios() {
        const servicios = obtenerServicios();
        tablaBody.innerHTML = "";

        if (servicios.length === 0) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td colspan="7">No hay servicios registrados</td>
            `;
            tablaBody.appendChild(fila);
            return;
        }

        servicios.forEach((servicio) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${servicio.nombre}</td>
                <td>${servicio.inicio} - ${servicio.fin}</td>
                <td>$${servicio.precio.toLocaleString()}</td>
                <td>${servicio.sede}</td>
                <td>${servicio.maxVales}</td>
                <td><span class="estado ${servicio.activo ? 'activo' : 'inactivo'}">${servicio.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-accion editar" data-id="${servicio.id}">Editar</button>
                    <button class="btn-accion eliminar" data-id="${servicio.id}">Eliminar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

        // Eventos para editar y eliminar
        document.querySelectorAll(".editar").forEach(btn => {
            btn.addEventListener("click", () => editarServicio(btn.dataset.id));
        });

        document.querySelectorAll(".eliminar").forEach(btn => {
            btn.addEventListener("click", () => eliminarServicioConfirmar(btn.dataset.id));
        });
    }

    function editarServicio(id) {
        const servicios = obtenerServicios();
        const servicio = servicios.find(s => s.id == id);
        
        if (servicio) {
            document.getElementById("id").value = servicio.id;
            document.getElementById("nombre").value = servicio.nombre;
            document.getElementById("inicio").value = servicio.inicio;
            document.getElementById("fin").value = servicio.fin;
            document.getElementById("precio").value = servicio.precio;
            document.getElementById("sede").value = servicio.sede;
            document.getElementById("maxVales").value = servicio.maxVales;
            document.getElementById("activo").value = servicio.activo.toString();
            document.getElementById("descripcion").value = servicio.descripcion || "";

            servicioEditando = servicio;
            btnEliminar.style.display = "inline-block";
            
            // Scroll al formulario
            document.querySelector("form").scrollIntoView({ behavior: "smooth" });
        }
    }

    function eliminarServicio() {
        if (!servicioEditando) {
            alert("No hay servicio seleccionado para eliminar.");
            return;
        }

        if (confirm(`¿Está seguro de eliminar el servicio "${servicioEditando.nombre}"?`)) {
            const servicios = obtenerServicios();
            const serviciosFiltrados = servicios.filter(s => s.id != servicioEditando.id);
            localStorage.setItem("servicios", JSON.stringify(serviciosFiltrados));
            
            form.reset();
            cargarServicios();
            servicioEditando = null;
            btnEliminar.style.display = "none";
            
            alert("Servicio eliminado correctamente.");
        }
    }

    function eliminarServicioConfirmar(id) {
        const servicios = obtenerServicios();
        const servicio = servicios.find(s => s.id == id);
        
        if (servicio && confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}"?`)) {
            const serviciosFiltrados = servicios.filter(s => s.id != id);
            localStorage.setItem("servicios", JSON.stringify(serviciosFiltrados));
            cargarServicios();
            alert("Servicio eliminado correctamente.");
        }
    }

    function filtrarServicios() {
        const termino = buscador.value.toLowerCase();
        const filas = tablaBody.querySelectorAll("tr");

        filas.forEach(fila => {
            const texto = fila.textContent.toLowerCase();
            fila.style.display = texto.includes(termino) ? "" : "none";
        });
    }

    function exportarServicios() {
        const servicios = obtenerServicios();
        
        if (servicios.length === 0) {
            alert("No hay servicios para exportar.");
            return;
        }

        // Crear CSV
        let csv = "Servicio,Horario,Precio,Sede,Vales por Turno,Estado,Descripción\n";
        
        servicios.forEach(servicio => {
            csv += `"${servicio.nombre}","${servicio.inicio} - ${servicio.fin}","${servicio.precio}","${servicio.sede}","${servicio.maxVales}","${servicio.activo ? 'Activo' : 'Inactivo'}","${servicio.descripcion || ''}"\n`;
        });

        // Descargar archivo
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `servicios_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function obtenerServicios() {
        const serviciosJSON = localStorage.getItem("servicios");
        return serviciosJSON ? JSON.parse(serviciosJSON) : [];
    }
});
