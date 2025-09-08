const semanaInput = document.getElementById('semana');
            const semanaSeleccionadaDiv = document.getElementById('semanaSeleccionada');
            semanaInput.addEventListener('change', () => {
              const fecha = new Date(semanaInput.value);
              if (isNaN(fecha)) {
                semanaSeleccionadaDiv.textContent = '';
                return;
              }
              const primerDia = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 1));
              const ultimoDia = new Date(fecha.setDate(primerDia.getDate() + 6));
              const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
              semanaSeleccionadaDiv.textContent = `Semana seleccionada: ${primerDia.toLocaleDateString('es-ES', opciones)} - ${ultimoDia.toLocaleDateString('es-ES', opciones)}`;
            });
            