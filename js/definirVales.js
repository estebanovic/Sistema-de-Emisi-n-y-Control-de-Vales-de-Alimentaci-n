document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-vales");
    const tablaBody = document.querySelector(".tabla-registros tbody");
  
    // Inicializar
    cargarVales();
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const tipoUsuario = document.getElementById("tipoUsuario").value;
      const servicio = document.getElementById("servicio").value;
      const valor = document.getElementById("valor").value;
      const maxVales = document.getElementById("maxVales").value;
  
      if (!tipoUsuario || !servicio || valor <= 0 || maxVales <= 0) {
        alert("Por favor complete todos los campos correctamente.");
        return;
      }
  
      const nuevoVale = {
        id: Date.now(),
        tipoUsuario,
        servicio,
        valor,
        maxVales
      };
  
      const vales = obtenerVales();
      vales.push(nuevoVale);
      localStorage.setItem("vales", JSON.stringify(vales));
  
      form.reset();
      cargarVales();
      alert("Vale guardado correctamente.");
    });
  
    function obtenerVales() {
      const valesJSON = localStorage.getItem("vales");
      return valesJSON ? JSON.parse(valesJSON) : [];
    }
  
    function cargarVales() {
      const vales = obtenerVales();
      tablaBody.innerHTML = "";
  
      vales.forEach((vale) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${vale.tipoUsuario}</td>
          <td>${vale.servicio}</td>
          <td>$${vale.valor}</td>
          <td>${vale.maxVales}</td>
          <td>
            <button class="btn-accion editar" data-id="${vale.id}">Editar</button>
            <button class="btn-accion eliminar" data-id="${vale.id}">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(fila);
      });
  
      // Eventos editar/eliminar
      document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarVale(btn.dataset.id));
      });
  
      document.querySelectorAll(".editar").forEach(btn => {
        btn.addEventListener("click", () => editarVale(btn.dataset.id));
      });
    }
  
    function eliminarVale(id) {
      if (!confirm("¿Desea eliminar este vale?")) return;
      let vales = obtenerVales().filter(v => v.id != id);
      localStorage.setItem("vales", JSON.stringify(vales));
      cargarVales();
    }
  
    function editarVale(id) {
      const vales = obtenerVales();
      const vale = vales.find(v => v.id == id);
  
      if (vale) {
        document.getElementById("tipoUsuario").value = vale.tipoUsuario;
        document.getElementById("servicio").value = vale.servicio;
        document.getElementById("valor").value = vale.valor;
        document.getElementById("maxVales").value = vale.maxVales;
  
        eliminarVale(id); // se elimina para reemplazar al guardar
      }
    }
  });
  