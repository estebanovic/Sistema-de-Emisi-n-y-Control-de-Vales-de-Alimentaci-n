# Sistema de Emisión y Control de Vales de Alimentación

## Descripción del Proyecto

[cite_start]Este proyecto tiene como objetivo automatizar el sistema de emisión y control de vales de alimentación para la empresa editorial "Libros Impresos S.A."[cite: 2, 5]. [cite_start]La solución busca resolver problemas como la emisión manual de vales, la pérdida de los mismos, y la falta de seguimiento sobre su uso[cite: 22, 24, 25]. [cite_start]El nuevo sistema permitirá a los funcionarios imprimir sus propios vales y registrar su uso, además de generar informes automáticos para la administración[cite: 28, 32, 34].

---

## Tareas del Proyecto

A continuación, se detallan las 9 tareas principales, basadas en los casos de uso y requerimientos del sistema.

### 1. Autenticar Usuarios (CU1)

* [cite_start]**Descripción:** Implementar el sistema de autenticación para todos los usuarios del sistema, incluyendo administradores, funcionarios y cajeros[cite: 36, 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 1:** Todos los usuarios del sistema deben autenticarse (funcionarios y cajeros)[cite: 36].
    * [cite_start]**RF 10:** En un principio el usuario se identificará a través de su código de funcionario más una password[cite: 46].

### 2. Imprimir Vale (CU2)

* [cite_start]**Descripción:** Desarrollar la funcionalidad para que los funcionarios puedan imprimir sus vales de alimentación en los dispositivos habilitados[cite: 30].
* **Requerimientos funcionales:**
    * [cite_start]**RF 2:** La impresión del vale debe ser rápida (menos de 2 segundos por persona)[cite: 37].
    * [cite_start]**RF 3:** El vale debe indicar el valor del servicio en base al perfil del comensal (obrero, jefe, gerente, etc.)[cite: 38].
    * [cite_start]**RF 7:** Los vales entregados deben quedar registrados en la base de datos del sistema[cite: 43].
    * [cite_start]**RF 8:** El servicio de alimentación que aparece en el vale debe ser de acuerdo al horario en que se identifica la persona[cite: 44].
    * [cite_start]**RF 11:** Una vez que un vale es impreso, no será posible emitir otro para el mismo horario[cite: 31].
    * [cite_start]**RF 13:** El sistema de emisión y control de vales efectuará las validaciones correspondientes y responderá si corresponde o no emitir el vale[cite: 50].

### 3. Definir Servicios (CU3)

* [cite_start]**Descripción:** Crear una interfaz para que el administrador pueda definir y gestionar los servicios de alimentación[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 3:** El vale debe indicar el valor del servicio en base al perfil del comensal[cite: 38].
    * [cite_start]**RF 9:** El sistema debe permitir generar más servicios de alimentación (extenderse de los servicios base, desayuno, almuerzo y cenas)[cite: 45].

### 4. Definir Vales / Tipo de Usuario (CU4)

* [cite_start]**Descripción:** Configurar la emisión de vales según el tipo de usuario y el servicio[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 3:** El vale debe indicar el valor del servicio en base al perfil del comensal[cite: 38].
    * [cite_start]**RF 6:** Pueden establecerse tipos de comensales, los cuales pueden sacar un vale (usuario normal) o varios vales en el mismo turno (por ejemplo, la secretaria del gerente puede estar habilitada para sacar vales para las visitas del gerente)[cite: 42].
    * [cite_start]**RF 8:** El servicio de alimentación que aparece en el vale debe ser de acuerdo al horario en que se identifica la persona[cite: 44].

### 5. Registrar Venta (CU5)

* [cite_start]**Descripción:** Desarrollar la funcionalidad para que el cajero del casino externo registre los productos consumidos con los vales[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 12:** El cajero del servicio de casinos externo, entregará los productos previo ingreso del número de vale al sistema, deberá registrarse el número de vale y los productos consumidos[cite: 48].

### 6. Generar Informe de Auditoría de Vales (CU6)

* [cite_start]**Descripción:** Crear la función para que el administrador obtenga informes de auditoría automáticos[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 4:** Se deben generar informes que indiquen la cantidad exacta de vales emitidos por servicio[cite: 39].

### 7. Generar Vales Adicionales (CU7)

* [cite_start]**Descripción:** Habilitar al administrador para crear vales adicionales que no están incluidos en la asignación regular[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 5:** Se debe permitir que el administrador genere vales adicionales a los funcionarios (por ejemplo, vales para retirar galletas y bebidas para una reunión)[cite: 40].

### 8. Generar Perfiles de Usuario (CU8)

* [cite_start]**Descripción:** Implementar la capacidad de definir diferentes tipos de comensales[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 6:** Pueden establecerse tipos de comensales, los cuales pueden sacar un vale (usuario normal) o varios vales en el mismo turno[cite: 42].

### 9. Enviar Informe de Vales (CU9)

* [cite_start]**Descripción:** Desarrollar un sistema automatizado para notificar a los funcionarios sobre el estado de sus vales[cite: 55].
* **Requerimientos funcionales:**
    * [cite_start]**RF 14:** El sistema debe enviar avisos de vales disponibles, utilizados y no utilizados mediante correo a cada funcionario al final de cada semana[cite: 52].