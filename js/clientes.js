//esperar que el DOM se cargue
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const formClientes = document.getElementById("form-clientes");
  const tablaClientes = document.querySelector(".tabla-registros tbody");

  //Expresiones para validación
  const regex = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    identificación: /^[0-9kK]{8,10}$/,
    telefono: /^[0-9+\-\s]{9,13}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    direccion: /^.{10,200}$/
  };

  //Mensajes de Error
  const mensajesError = {
    nombre: "debe tener entre 2 y 50 caracteres (solo letras y espacio)",
    identificación: "debe tener entre 8 y 10 digitos y/o la K",
    telefono: "debe tener entre 9 y 13 digitos",
    email: "ingrese un correo electronico valido",
    direccion: "debe tener entre 10 y 200 caracteres"
  };

  //inicializar aplicacion
  function inicializar() {
    //Cargar Clientes Existentes
    cargarClientes();
    //Agregar Eventos
    formClientes.addEventListener("submit", procesarFormulario);
    //Agregar Validacion en tiempo real
    agregarValidacionTiempoReal();
  }

  function agregarValidacionTiempoReal() {
    const campos = ["nombre", "identificacion", "telefono", "email", "direccion"];

    campos.forEach(campo => {
      const input = document.getElementById(campo);
      input.addEventListener("blur", () => validarCampo(input));
      input.addEventListener("input", () => limpiarError(input));
    });

    const tipoCliente = document.getElementById("tipo-cliente");
    tipoCliente.addEventListener("change", () => limpiarError(tipoCliente));
  }

  //Validar Campos Individualmente
  function validarCampo(campo) {
    let valido = true;
    let mensaje = "";
    switch (campo.id) {
      case "nombre":
        valido = regex.nombre.test(campo.value.trim());
        mensaje = mensajesError.nombre;
        break;
      case "identificacion":
        valido = regex.identificación.test(campo.value.trim());
        mensaje = mensajesError.identificación;
        break;
      case "telefono":
        valido = regex.telefono.test(campo.value.trim());
        mensaje = mensajesError.telefono;
        break;
      case "email":
        valido = regex.email.test(campo.value.trim());
        mensaje = mensajesError.email;
        break;
      case "direccion":
        valido = regex.direccion.test(campo.value.trim());
        mensaje = mensajesError.direccion;
        break;
    }
    if (!valido) {
      mostrarError(campo, mensaje);
    } else {
      limpiarError(campo);
    }
    return valido;
  }

  //mostrar mensaje de error de un campo
  function mostrarError(campo, mensaje) {
    limpiarError(campo);
    //Crear elemento de error
    const error = document.createElement("span");
    error.className = "error-mensaje";
    error.textContent = mensaje;

    //insertar campo
    campo.parentNode.appendChild(error);

    //resaltar campo
    campo.classList.add("error");
  }

  //limpiar mensaje de error campo
  function limpiarError(campo) {
    //Elimino el mensaje Error si existe
    const error = campo.parentNode.querySelector(".error-mensaje");
    if (error) {
      error.remove();
    }
    //Quitar clase error
    campo.classList.remove("error");
  }

  //procesar el envio del formulario
  function procesarFormulario(e) {
    e.preventDefault();

    //validar todos los campos
    const campos = ["nombre", "identificacion", "telefono", "email", "direccion", "tipo-cliente"];
    let formulariovalido = true;

    campos.forEach(campoId => {
      const campo = document.getElementById(campoId);
      if (!validarCampo(campo)) {
        formulariovalido = false;
      }
    });
    // si el formulario es valido
    if (formulariovalido) {
      guardarCliente();
    }
  }

  // guardar cliente en local storage
  function guardarCliente() {
    //obtener valores del formulario
    const cliente = {
      id: Date.now(), //id unico basado en Timestamp
      nombre: document.getElementById("nombre").value.trim(),
      identificación: document.getElementById("identificacion").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
      direccion: document.getElementById("direccion").value.trim(),
      tipocliente: document.getElementById("tipo-cliente").value
    };

    //obtener clientes existentes
    let clientes = obtenerClientes();

    //verificar si la identificacion ya existe
    const existe = clientes.some(c => c.identificación === cliente.identificación && c.id !== cliente.id);
    if (existe) {
      alert("ya existe este usuario con este RUT");
      return;
    }
    //Agregar nuevo cliente
    clientes.push(cliente);
    //Guardar en el localStorage
    localStorage.setItem("clientes", JSON.stringify(clientes));

    //reiniciar el formulario
    formClientes.reset();

    //mensaje de registro
    alert("Cliente registrado exitosamente");
  }

  //aobtener clientes existentes
  function obtenerClientes() {
    const clientesJSON = localStorage.getItem("clientes");
    return clientesJSON ? JSON.parse(clientesJSON) : [];
  }

  //cargar clientes en la tabla
  function cargarClientes() {
    const clientes = obtenerClientes();
    //limpiar tabla
    tablaClientes.innerHTML = "";

    //llenar la tabla
    clientes.forEach(cliente => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
      <td>${cliente.nombre}</td>
      <td>${cliente.identificación}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.tipocliente}</td>
      <td>
      <button class="btn-accion editar" data-id="${cliente.id}">editar</button>
      <button class="btn-accion eliminar" data-id="${cliente.id}">eliminar</button>
      </td>
      `;
      tablaClientes.appendChild(fila);
    });
    //agregar eventos a los botones
    agregarEventListenerBotones();
  }

  function agregarEventListenerBotones() {
    //botones de editar
    document.querySelectorAll(".btn-accion.editar").forEach(boton => {
      boton.addEventListener("click", () => editarCliente(boton.dataset.id));
    });

    //botones de Eliminar
    document.querySelectorAll(".btn-accion.eliminar").forEach(boton => {
      boton.addEventListener("click", () => eliminarCliente(boton.dataset.id));
    });
  }
  //editar cliente
  function editarCliente(id){
    const clientes = obtenerClientes()
    const cliente = clientes.find (c => c.id == id)

    if (cliente){
      //llenar formulario con datos del cliente
      document.getElementById("nombre").value = cliente.nombre
      document.getElementById("identificacion").value = cliente.identificación
      document.getElementById("telefono").value = cliente.telefono
      document.getElementById("email").value = cliente.email
      document.getElementById("direccion").value = cliente.direccion
      document.getElementById("tipo-cliente").value = cliente.tipoCliente

      //cambiar el boton de actualizar
      const botonSumit = formClientes.querySelector("button[type= submit]")
      botonSumit.textContent="Actualizar cliente"
      //guardar el ID del cliente que se esta editando
      formClientes.dataset.editandoId = id
      //cambiar el evento listener del formulario para actualzar en el lugar de guardar
      formClientes.removeEventListener("submit", procesarFormulario);
      formClientes.addEventListener("submit", actualizarCliente)
    }
  }

  //Actualizar Cliente existente
  function actualizarCliente(e){
    e.preventDefault()
    //validar campos
    const campos = ["nombre", "identificacion", "telefono", "email", "direccion", "tipo-cliente"]
    let formulariovalido = true

    campos.forEach(campoId =>{
      const campo = document.getElementById(campoId)
      if(!validarCampo(campo)){
        formulariovalido= false
      }
    })
    if (!formulariovalido) return
    //obtener ID del cliente
    const id = formClientes.dataset.editandoId
    //obetener los valores del formulario
    const clienteActualizado = {
      i: paeseInt(id),
      nombre: document.getElementById("nombre").value.trim(),
      identificación: document.getElementById("identificacion").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
      direccion: document.getElementById("direccion").value.trim(),
      tipocliente: document.getElementById("tipo-cliente").value
    }
    //obtener clientes existentes
    let clientes = obtenerClientes()

    //encontrar  el indice del cliente a actualizar
    const indice = clientes.findIndex(c => c.id == id)

    if (indice !== -1 ){
      //actualizar cliente
      clientes[indice] = clienteActualizado
      //guardar en el localStorage
      localStorage.setItem("clientes",JSON.stringify(clientes))

      //actualizar tabla
      cargarClientes()

      //reiniciar el formulario
      formClientes.reset()

      //restaurar el boton a registrar cliente
      const botonSubmit = formClientes.querySelector("button[type= submit]")
      botonSubmit.textContent = "registrar cliente"

      //eliminar id de la edicion
      delete formClientes.dataset.editandoId

      //restaurar los eventos listener
      formClientes.removeEventListener("submit", actualizarCliente)
      formClientes.addEventListener("submit", procesarFormulario)

      //mostar el mensaje de actualizado con exito
      alert("cliente actualizado con exito")

    }

  }

  //eliminar cliente
  function eliminarCliente(id){
    if (confirm("esta seguro cabron???")){
      //obtener clientes
      let clientes = obtenerClientes()
      //filtrar el cliente a eliminar
      clientes = clientes.filter(c => c.id != id)
      
      //guardar en el localstorage
      localStorage.setItem("clientes",JSON.stringify(clientes))

      //actualizar tabla
      cargarClientes()

      //mostar el mensaje de eliminar
      alert("eliminaste al Cabron")
    }
  }

  //inicializar
  inicializar();
});
