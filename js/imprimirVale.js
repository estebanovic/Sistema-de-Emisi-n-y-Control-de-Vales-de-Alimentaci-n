document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-generar-vale");
    const tablaBody = document.getElementById("tabla-vales");
    const horaActual = document.getElementById("horaActual");
    const servicioAsignado = document.getElementById("servicioAsignado");
    const vistaPrevia = document.getElementById("vista-previa");
    const valeContent = document.getElementById("vale-content");
    const btnImprimir = document.getElementById("btn-imprimir");
    const btnNuevo = document.getElementById("btn-nuevo");
    const servicioSelect = document.getElementById("servicio");

    let valeActual = null;

    // Inicializar
    actualizarHora();
    cargarValesHoy();
    configurarAsignacionAutomatica();

    // Actualizar hora cada minuto
    setInterval(actualizarHora, 60000);

    // Event listeners
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        generarVale();
    });

    btnImprimir.addEventListener("click", () => {
        imprimevale();
    });

    btnNuevo.addEventListener("click", () => {
        nuevoVale();
    });

    // Cambio en tipo de usuario para actualizar servicio automáticamente
    document.getElementById("tipoUsuario").addEventListener("change", () => {
        configurarAsignacionAutomatica();
    });

    function actualizarHora() {
        const ahora = new Date();
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const horaFormateada = `${hora}:${minutos}`;
        
        horaActual.textContent = horaFormateada;
        
        // Asignar servicio según la hora
        const servicio = asignarServicioPorHora(hora);
        servicioAsignado.textContent = servicio;
        
        // Actualizar el select si no hay selección manual
        if (!servicioSelect.value) {
            servicioSelect.value = servicio;
        }
    }

    function asignarServicioPorHora(hora) {
        if (hora >= 6 && hora < 10) {
            return "desayuno";
        } else if (hora >= 12 && hora < 14) {
            return "almuerzo";
        } else if (hora >= 16 && hora < 18) {
            return "once";
        } else if (hora >= 19 && hora < 21) {
            return "cena1";
        } else if (hora >= 21 && hora < 23) {
            return "cena2";
        } else {
            return "desayuno"; // Por defecto
        }
    }

    function configurarAsignacionAutomatica() {
        const tipoUsuario = document.getElementById("tipoUsuario").value;
        const hora = new Date().getHours();
        
        if (tipoUsuario) {
            const servicioRecomendado = asignarServicioPorHora(hora);
            servicioSelect.value = servicioRecomendado;
        }
    }

    function generarVale() {
        const tipoUsuario = document.getElementById("tipoUsuario").value;
        const nombreComensal = document.getElementById("nombreComensal").value;
        const servicio = document.getElementById("servicio").value;
        const cantidadVales = parseInt(document.getElementById("cantidadVales").value);
        const observaciones = document.getElementById("observaciones").value;

        if (!tipoUsuario || !nombreComensal || !servicio || cantidadVales <= 0) {
            alert("Por favor complete todos los campos correctamente.");
            return;
        }

        // Obtener configuración de vales desde localStorage
        const valesConfig = obtenerConfiguracionVales();
        const configVale = valesConfig.find(v => 
            v.tipoUsuario === tipoUsuario && v.servicio === servicio
        );

        if (!configVale) {
            alert(`No se encontró configuración para ${tipoUsuario} - ${servicio}. Por favor, defina primero los vales en la sección correspondiente.`);
            return;
        }

        // Verificar límite de vales por turno
        if (cantidadVales > configVale.maxVales) {
            alert(`La cantidad máxima de vales para ${tipoUsuario} - ${servicio} es ${configVale.maxVales}.`);
            return;
        }

        const valorUnitario = parseInt(configVale.valor);
        const valorTotal = valorUnitario * cantidadVales;

        valeActual = {
            id: Date.now(),
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            tipoUsuario,
            nombreComensal,
            servicio,
            cantidadVales,
            valorUnitario,
            valorTotal,
            observaciones,
            numeroVale: generarNumeroVale()
        };

        // Guardar en localStorage
        const valesGenerados = obtenerValesGenerados();
        valesGenerados.push(valeActual);
        localStorage.setItem("valesGenerados", JSON.stringify(valesGenerados));

        // Mostrar vista previa
        mostrarVistaPrevia();
        
        // Actualizar tabla
        cargarValesHoy();
        
        // Habilitar botón de impresión
        btnImprimir.disabled = false;

        alert("Vale generado correctamente.");
    }

    function mostrarVistaPrevia() {
        if (!valeActual) return;

        const servicioNombres = {
            desayuno: "Desayuno",
            almuerzo: "Almuerzo", 
            once: "Once",
            cena1: "Cena 1",
            cena2: "Cena 2"
        };

        const tipoNombres = {
            obrero: "Obrero",
            administrativo: "Administrativo",
            jefe: "Jefe",
            gerente: "Gerente",
            visita: "Visita"
        };

        valeContent.innerHTML = `
            <div class="vale-ticket">
                <div class="vale-header">
                    <h2>VALE DE ALIMENTACIÓN</h2>
                    <p class="numero-vale">N° ${valeActual.numeroVale}</p>
                </div>
                <div class="vale-body">
                    <div class="vale-info">
                        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                        <p><strong>Hora:</strong> ${valeActual.hora}</p>
                        <p><strong>Comensal:</strong> ${valeActual.nombreComensal}</p>
                        <p><strong>Tipo:</strong> ${tipoNombres[valeActual.tipoUsuario]}</p>
                        <p><strong>Servicio:</strong> ${servicioNombres[valeActual.servicio]}</p>
                        <p><strong>Cantidad:</strong> ${valeActual.cantidadVales} vale(s)</p>
                        <p><strong>Valor Unitario:</strong> $${valeActual.valorUnitario.toLocaleString()}</p>
                        <p><strong>Valor Total:</strong> $${valeActual.valorTotal.toLocaleString()}</p>
                        ${valeActual.observaciones ? `<p><strong>Observaciones:</strong> ${valeActual.observaciones}</p>` : ''}
                    </div>
                </div>
                <div class="vale-footer">
                    <p>Ferretería El Martillo - Sistema de Vales</p>
                    <p>Vale válido solo para el servicio indicado</p>
                </div>
            </div>
        `;

        vistaPrevia.style.display = "block";
    }

    function imprimevale() {
        if (!valeActual) {
            alert("No hay vale para imprimir.");
            return;
        }

        // Crear ventana de impresión
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vale de Alimentación</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .vale-ticket { border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
                    .vale-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
                    .vale-header h2 { margin: 0; color: #e74c3c; }
                    .numero-vale { font-size: 18px; font-weight: bold; margin: 5px 0; }
                    .vale-body { margin-bottom: 15px; }
                    .vale-info p { margin: 8px 0; }
                    .vale-footer { text-align: center; border-top: 1px solid #000; padding-top: 10px; font-size: 12px; color: #666; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                ${valeContent.innerHTML}
            </body>
            </html>
        `);
        
        ventanaImpresion.document.close();
        ventanaImpresion.print();
    }

    function nuevoVale() {
        form.reset();
        vistaPrevia.style.display = "none";
        btnImprimir.disabled = true;
        valeActual = null;
        configurarAsignacionAutomatica();
    }

    function generarNumeroVale() {
        const hoy = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const valesHoy = obtenerValesGenerados().filter(v => v.fecha === new Date().toISOString().split('T')[0]);
        const numero = (valesHoy.length + 1).toString().padStart(3, '0');
        return `${hoy}${numero}`;
    }

    function obtenerConfiguracionVales() {
        const valesJSON = localStorage.getItem("vales");
        return valesJSON ? JSON.parse(valesJSON) : [];
    }

    function obtenerValesGenerados() {
        const valesJSON = localStorage.getItem("valesGenerados");
        return valesJSON ? JSON.parse(valesJSON) : [];
    }

    function cargarValesHoy() {
        const vales = obtenerValesGenerados();
        const hoy = new Date().toISOString().split('T')[0];
        const valesHoy = vales.filter(v => v.fecha === hoy);
        
        tablaBody.innerHTML = "";

        valesHoy.forEach((vale) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${vale.hora}</td>
                <td>${vale.nombreComensal}</td>
                <td>${vale.tipoUsuario}</td>
                <td>${vale.servicio}</td>
                <td>${vale.cantidadVales}</td>
                <td>$${vale.valorTotal.toLocaleString()}</td>
                <td>
                    <button class="btn-accion reimprimir" data-id="${vale.id}">Reimprimir</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });

        // Eventos para reimprimir
        document.querySelectorAll(".reimprimir").forEach(btn => {
            btn.addEventListener("click", () => reimprimevale(btn.dataset.id));
        });
    }

    function reimprimevale(id) {
        const vales = obtenerValesGenerados();
        const vale = vales.find(v => v.id == id);
        
        if (vale) {
            valeActual = vale;
            mostrarVistaPrevia();
            imprimevale();
        }
    }
});
