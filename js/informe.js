const semanaInput = document.getElementById('semana');
const semanaSeleccionadaDiv = document.getElementById('semanaSeleccionada');
const turnoInput = document.getElementById('turno');
const btnEnviar = document.getElementById('btnEnviar');

function validarForm() {
  if (semanaInput.value && turnoInput.value) {
    btnEnviar.disabled = false;
  } else {
    btnEnviar.disabled = true;
  }
}

semanaInput.addEventListener('change', () => {
  const fecha = new Date(semanaInput.value);
  if (isNaN(fecha)) {
    semanaSeleccionadaDiv.textContent = '';
    validarForm();
    return;
  }
  const primerDia = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 1));
  const ultimoDia = new Date(fecha.setDate(primerDia.getDate() + 6));
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  semanaSeleccionadaDiv.textContent = `Semana seleccionada: ${primerDia.toLocaleDateString('es-ES', opciones)} - ${ultimoDia.toLocaleDateString('es-ES', opciones)}`;
  validarForm();
});

turnoInput.addEventListener('change', validarForm);

document.getElementById('form-tickets').addEventListener('submit', function(e) {
  if (btnEnviar.disabled) e.preventDefault();
});
