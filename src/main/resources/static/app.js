const workspace = document.getElementById("workspace");

const consoleOutput = document.getElementById("consoleOutput");

/* ===================================
   CONSOLA JSON
=================================== */
function mostrarJSON(data){
    
    consoleOutput.textContent = JSON.stringify(
        data,
        null,
        2
    );
}

/* ==========================================
   NAVEGACIÓN GENERAL - AUTORENT
========================================== */
function activarMenu(modulo) {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    const moduloActual = modulo.toLowerCase();

    // Limpiar selecciones anteriores
    sidebar.querySelectorAll(
        "[data-modulo], [data-submenu]"
    ).forEach(boton => {

        boton.classList.remove("active");
        boton.removeAttribute("aria-current");

    });

    // Cerrar todos los submenús
    sidebar.querySelectorAll(".nav-group")
        .forEach(grupo => {

            grupo.classList.remove("expanded");

            const submenu = grupo.querySelector(".submenu");
            const principal = grupo.querySelector("[data-modulo]");

            if (submenu) submenu.hidden = true;

            if (principal) {
                principal.setAttribute("aria-expanded", "false");
            }

        });

    // Encontrar módulo seleccionado
    const botonActivo = Array.from(
        sidebar.querySelectorAll("[data-modulo]")
    ).find(boton =>
        boton.dataset.modulo.toLowerCase() === moduloActual
    );

    if (!botonActivo) return;

    botonActivo.classList.add("active");
    botonActivo.setAttribute("aria-current", "page");

    // Abrir submenú correspondiente
    const grupo = botonActivo.closest(".nav-group");

    if (grupo) {

        grupo.classList.add("expanded");

        const submenu = grupo.querySelector(".submenu");

        if (submenu) {

            submenu.hidden = false;

            const opcion = Array.from(
                submenu.querySelectorAll("[data-submenu]")
            ).find(boton =>
                boton.dataset.submenu.toLowerCase() === moduloActual
            );

            if (opcion) {
                opcion.classList.add("active");
            }

        }

        botonActivo.setAttribute("aria-expanded", "true");

    }

}

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    })[c]);
}

function mostrarMensaje(id, tipo, mensaje) {
    const destino = document.getElementById(id);
    if (destino) destino.innerHTML = `<div class="message-${tipo}" role="alert">${tipo === 'error' ? '❌' : '✅'} ${escaparHTML(mensaje)}</div>`;
}

/* ==========================================
   DASHBOARD DINÁMICO - INICIO
========================================== */
async function mostrarInicio(){

    // Mostrar pantalla de carga

    workspace.innerHTML = `

        <div class="dashboard-loading">

            <div class="loading-spinner"></div>

            <h3>Cargando dashboard...</h3>

            <p>Consultando información del sistema</p>

        </div>

    `;

    try{

        // Consultar todos los vehículos

        const response = await fetch("/api/autos");

        let autos = [];

        if (response.ok) {

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("La API no devolvió una lista válida");
            }

            autos = data;

        } else {

            const mensaje = await response.text();

            // El backend utiliza 404 cuando no existen vehículos.
            if (
                response.status === 404 &&
                mensaje.toLowerCase().includes("no hay actualmente autos registrados")
            ) {

                autos = [];

            } else {

                throw new Error(
                    `Error HTTP ${response.status}: ${mensaje}`
                );

            }

        }

        // Calcular estadísticas para autos

        const totalAutos = autos.length;

        const disponibles = autos.filter(
            auto => auto.estado === "DISPONIBLE"
        ).length;

        const alquilados = autos.filter(
            auto => auto.estado === "ALQUILADO"
        ).length;

        const mantenimiento = autos.filter(
            auto => auto.estado === "MANTENIMIENTO"
        ).length;

        // Calcular estadísticas para clientes

        const responseClientes =
            await fetch("/api/clientes");

        let clientes = [];

        if(responseClientes.ok){

            const dataClientes =
                await responseClientes.json();

            clientes = Array.isArray(dataClientes)
                ? dataClientes
                : [];
        }

        const totalClientes =
            clientes.length;

        // Calcular estadísticas para alquileres

        const responseAlquileres =
            await fetch("/api/alquileres");

        let alquileres = [];

        if(responseAlquileres.ok){

            const dataAlquileres =
                await responseAlquileres.json();

            alquileres = Array.isArray(dataAlquileres)
                ? dataAlquileres
                : [];
        }

        const totalAlquileres =
            alquileres.length;

        const alquileresActivos =
            alquileres.filter(
                alquiler =>
                    alquiler.estado === "ACTIVO"
            ).length;

        const alquileresFinalizados =
            alquileres.filter(
                alquiler =>
                    alquiler.estado === "FINALIZADO"
            ).length;

        const clientesConAlquilerActivo =
        new Set(
            alquileres
                .filter(
                    alquiler =>
                        alquiler.estado === "ACTIVO"
                )
                .map(
                    alquiler =>
                        alquiler.clienteId
                )
        ).size;

        // =====================================
        // SI NO EXISTEN AUTOS
        // =====================================

        if(totalAutos === 0){

            mostrarInicioVacio();

            return;

        }

        // =====================================
        // SI EXISTEN AUTOS
        // =====================================

        workspace.innerHTML = `

            <div class="dashboard-header">

                <div>

                    <h2>
                        Panel de Control
                    </h2>

                    <p>
                        Resumen general de AutoRent Enterprise
                    </p>

                </div>

                <div class="dashboard-badge">

                    ● Sistema operativo

                </div>

            </div>


            <!-- =====================================
                VEHÍCULOS
            ===================================== -->

            <h3 class="dashboard-section-title">
                🚘 Vehículos
            </h3>

            <div class="dashboard-stats">

                <!-- TOTAL -->
                <button
                    class="stat-card stat-total"
                    onclick="irAConsultaAutos('todos')">

                    <div class="stat-icon">
                        🚘
                    </div>

                    <div class="stat-content">

                        <span>Total de Vehículos</span>

                        <h2>${totalAutos}</h2>

                        <small>Vehículos registrados</small>

                    </div>

                </button>

                <!-- DISPONIBLES -->
                <button
                    class="stat-card stat-disponibles"
                    onclick="irAConsultaAutos('disponibles')">

                    <div class="stat-icon">
                        ✅
                    </div>

                    <div class="stat-content">

                        <span>Disponibles</span>

                        <h2>${disponibles}</h2>

                        <small>Listos para alquilar</small>

                    </div>

                </button>

                <!-- ALQUILADOS -->
                <button
                    class="stat-card stat-alquilados"
                    onclick="irAConsultaAutos('alquilados')">

                    <div class="stat-icon">
                        🕒
                    </div>

                    <div class="stat-content">

                        <span>Alquilados</span>

                        <h2>${alquilados}</h2>

                        <small>Vehículos en uso</small>

                    </div>

                </button>

                <!-- MANTENIMIENTO -->
                <button
                    class="stat-card stat-mantenimiento"
                    onclick="irAConsultaAutos('mantenimiento')">

                    <div class="stat-icon">
                        🔧
                    </div>

                    <div class="stat-content">

                        <span>En Mantenimiento</span>

                        <h2>${mantenimiento}</h2>

                        <small>Vehículos en taller</small>

                    </div>

                </button>

            </div>

            <!-- =====================================
                CLIENTES
            ===================================== -->

            <h3 class="dashboard-section-title">
                👥 Clientes
            </h3>

            <div class="dashboard-stats">

                <button
                    class="stat-card"
                    onclick="irAConsultaClientes('todos')">

                    <div class="stat-icon">
                        👥
                    </div>

                    <div class="stat-content">

                        <span>Clientes</span>

                        <h2>${totalClientes}</h2>

                        <small>Clientes registrados</small>

                    </div>

                </button>

                <button
                    class="stat-card"
                    onclick="irAConsultaClientes('todos')">

                    <div class="stat-icon">
                        📋
                    </div>

                    <div class="stat-content">

                        <span>Con Alquiler Activo</span>

                        <h2>${clientesConAlquilerActivo}</h2>

                        <small>Actualmente alquilando</small>

                    </div>

                </button>

            </div>

            <!-- =====================================
                ALQUILERES
            ===================================== -->

            <h3 class="dashboard-section-title">
                📄 Alquileres
            </h3>

            <div class="dashboard-stats">

                <button
                    class="stat-card"
                    onclick="irAConsultaAlquileres('todos')">

                    <div class="stat-icon">
                        📄
                    </div>

                    <div class="stat-content">

                        <span>Total</span>

                        <h2>${totalAlquileres}</h2>

                        <small>Registrados</small>

                    </div>

                </button>

                <button
                    class="stat-card"
                    onclick="irAConsultaAlquileres('activos')">

                    <div class="stat-icon">
                        🟢
                    </div>

                    <div class="stat-content">

                        <span>Activos</span>

                        <h2>${alquileresActivos}</h2>

                        <small>Actualmente vigentes</small>

                    </div>

                </button>

                <button
                    class="stat-card"
                    onclick="irAConsultaAlquileres('finalizados')">

                    <div class="stat-icon">
                        📁
                    </div>

                    <div class="stat-content">

                        <span>Finalizados</span>

                        <h2>${alquileresFinalizados}</h2>

                        <small>Historial completado</small>

                    </div>

                </button>

            </div>

            <!-- =====================================
                ACCESOS RÁPIDOS
            ===================================== -->

            <div class="dashboard-section">

                <div class="section-header">

                    <h3>
                        Accesos Rápidos
                    </h3>

                    <p>
                        Administra los módulos del sistema
                    </p>

                </div>

                <div class="dashboard-modules">

                    <!-- AUTOS -->

                    <button
                        class="dashboard-module"
                        onclick="mostrarAutos()">

                        <div class="module-icon">
                            🚘
                        </div>

                        <div class="module-content">

                            <h3>
                                Gestión de Autos
                            </h3>

                            <p>
                                Consulta y administra
                                los vehículos registrados.
                            </p>

                            <span>
                                Gestionar vehículos →
                            </span>

                        </div>

                    </button>

                    <!-- CLIENTES -->

                    <button
                        class="dashboard-module"
                        onclick="irmostrarClientes()">

                        <div class="module-icon">
                            👥
                        </div>

                        <div class="module-content">

                            <h3>
                                Gestión de Clientes
                            </h3>

                            <p>
                                Consulta y administra
                                los clientes registrados.
                            </p>

                            <span>
                                Gestionar clientes →
                            </span>

                        </div>

                    </button>

                    <!-- ALQUILERES -->

                    <button
                        class="dashboard-module"
                        onclick="mostrarAlquileres()">

                        <div class="module-icon">
                            📋
                        </div>

                        <div class="module-content">

                            <h3>
                                Gestión de Alquileres
                            </h3>

                            <p>
                                Consulta alquileres,
                                pagos y finalizaciones.
                            </p>

                            <span>
                                Gestionar alquileres →
                            </span>

                        </div>

                    </button>

                </div>

            </div>

        `;


        // Actualizar consola JSON

        mostrarJSON({

            modulo: "Dashboard",

            totalVehiculos: totalAutos,

            disponibles: disponibles,

            alquilados: alquilados,

            mantenimiento: mantenimiento,

            totalClientes: totalClientes,

            clientesConAlquilerActivo: clientesConAlquilerActivo,

            totalAlquileres: totalAlquileres,

            alquileresActivos: alquileresActivos,

            alquileresFinalizados: alquileresFinalizados,

            estado: "Información cargada correctamente"

        });


    }catch(error){

        workspace.innerHTML = `

            <div class="card">

                <div class="message-error">

                    ❌ Error al cargar el dashboard:
                    ${error.message}

                </div>

                <button
                    class="btn-primary"
                    onclick="mostrarInicio()">

                    Reintentar

                </button>

            </div>

        `;

        mostrarJSON({

            modulo: "Dashboard",

            error: error.message

        });

    }

}

/* ==========================================
   INICIO SIN VEHÍCULOS
========================================== */
function mostrarInicioVacio(){

    workspace.innerHTML = `

        <div class="dashboard-empty">

            <div class="empty-icon">
                🚘
            </div>

            <h2>
                ¡Bienvenido a AutoRent Enterprise!
            </h2>

            <p>
                Tu sistema de gestión vehicular está listo.
            </p>

            <p>
                Para comenzar a visualizar estadísticas,
                consultas y reportes, necesitas registrar
                información en el sistema.
            </p>

        </div>


        <div class="card">

            <h3>
                🚀 Configura tu sistema
            </h3>

            <p>
                Sigue estos pasos para comenzar a utilizar
                AutoRent Enterprise.
            </p>

            <div class="setup-grid">

                <div class="setup-card">

                    <div class="setup-icon">
                        🚘
                    </div>

                    <h4>1. Registrar vehículos</h4>

                    <p>
                        Agrega los vehículos que estarán
                        disponibles para alquilar.
                    </p>

                    <button
                        class="btn-primary"
                        onclick="mostrarAutos(); formCrearAuto();">

                        Registrar vehículo →

                    </button>

                </div>


                <div class="setup-card">

                    <div class="setup-icon">
                        👥
                    </div>

                    <h4>2. Registrar clientes</h4>

                    <p>
                        Registra las personas que utilizarán
                        los servicios de alquiler.
                    </p>

                    <button
                        class="btn-primary"
                        onclick="mostrarClientes()">

                        Ir a Clientes →

                    </button>

                </div>


                <div class="setup-card">

                    <div class="setup-icon">
                        📋
                    </div>

                    <h4>3. Crear alquileres</h4>

                    <p>
                        Asigna vehículos a clientes
                        y administra sus alquileres.
                    </p>

                    <button
                        class="btn-primary"
                        onclick="mostrarAlquileres()">

                        Ir a Alquileres →

                    </button>

                </div>

            </div>

            <div class="setup-note">

                💡 Una vez registres tu primer vehículo,
                el Inicio mostrará automáticamente
                las estadísticas de tu flota.

            </div>

        </div>

    `;

    mostrarJSON({

        modulo: "Inicio",

        totalVehiculos: 0,

        estado: "Sistema sin vehículos registrados"

    });

}

/* ==========================================
   NAVEGACIÓN DESDE DASHBOARD PARA AUTOS
========================================== */
async function irAConsultaAutos(tipo){

    // Cargar módulo de autos

    mostrarAutos();

    // Ejecutar consulta correspondiente

    switch(tipo){

        case "todos":

            await consultarTodosAutos();

            break;

        case "disponibles":

            await consultarDisponibles();

            break;

        case "alquilados":

            await consultarAlquilados();

            break;

        case "mantenimiento":

            await consultarMantenimiento();

            break;

    }

    // Seleccionar tarjeta correspondiente

    const indices = {

        todos:0,

        disponibles:1,

        alquilados:2,

        mantenimiento:3

    };

    const botones = document.querySelectorAll(
        "#workspace .module-grid .action-btn"
    );

    // El primer botón es Crear Auto.
    // Por eso sumamos 1 al índice.

    const indice = indices[tipo] + 1;

    botones.forEach(button => {

        button.classList.remove("active");

    });

    if(botones[indice]){

        botones[indice].classList.add("active");

    }
}

/* ==========================================
   NAVEGACIÓN DESDE DASHBOARD PARA CLIENTES
========================================== */
async function irAConsultaClientes(tipo){

    mostrarClientes();

    switch(tipo){

        case "todos":

            await consultarTodosClientes();

            break;

    }

}

/* ==========================================
   NAVEGACIÓN DESDE DASHBOARD PARA ALQUILER
========================================== */
async function irAConsultaAlquileres(tipo){

    mostrarAlquileres();

    switch(tipo){

        case "todos":

            await consultarTodosAlquileres();

            break;

        case "activos":

            await consultarAlquileresActivos();

            break;

        case "finalizados":

            await consultarAlquileresFinalizados();

            break;

    }

}

/* ==========================================
   SELECCIÓN DE TARJETAS DE OPERACIONES
========================================== */
function seleccionarOperacion(operacion) {

    const botones = document.querySelectorAll(
        "#workspace .module-grid .action-btn"
    );
    
    botones.forEach(boton => {

        const seleccionada =
            boton.dataset.operacion === operacion;

        boton.classList.toggle("active", seleccionada);

        boton.setAttribute(
            "aria-pressed",
            String(seleccionada)
        );

    });

}

/* ===================================
   OPCIONES DE GESTION DE LOS AUTOS
=================================== */
function mostrarAutos() {

    // Activar Autos en el menú lateral
    activarMenu("Autos");

    seleccionarOperacion("crear");
    seleccionarOperacion("todos");
    seleccionarOperacion("disponibles");
    seleccionarOperacion("alquilados");
    seleccionarOperacion("mantenimiento");
    seleccionarOperacion("eliminar");
    
    // Mostrar interfaz del módulo
    workspace.innerHTML = `

        <div class="module-header">

            <h2>Gestión de Autos</h2>

            <p class="module-description">
                Administra el inventario de vehículos de la empresa.
            </p>

        </div>

        <div class="module-grid">

            <!-- CREAR AUTO -->

            <button
                type="button"
                class="action-btn"
                data-operacion="crear"
                aria-pressed="false"
                onclick="formCrearAuto()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-plus"></i>
                </span>

                <span class="action-title">
                    Crear Auto
                </span>

                <small>
                    Registrar un nuevo vehículo
                </small>

            </button>


            <!-- CONSULTAR TODOS -->

            <button
                type="button"
                class="action-btn"
                data-operacion="todos"
                aria-pressed="false"
                onclick="consultarTodosAutos()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-car-side"></i>
                </span>

                <span class="action-title">
                    Consultar Todos los Autos
                </span>

                <small>
                    Ver inventario completo
                </small>

            </button>


            <!-- CONSULTAR DISPONIBLES -->

            <button
                type="button"
                class="action-btn"
                data-operacion="disponibles"
                aria-pressed="false"
                onclick="consultarDisponibles()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-circle-check"></i>
                </span>

                <span class="action-title">
                    Consultar Autos Disponibles
                </span>

                <small>
                    Vehículos listos para alquilar
                </small>

            </button>


            <!-- CONSULTAR ALQUILADOS -->

            <button
                type="button"
                class="action-btn"
                data-operacion="alquilados"
                aria-pressed="false"
                onclick="consultarAlquilados()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-clock"></i>
                </span>

                <span class="action-title">
                    Consultar Autos Alquilados
                </span>

                <small>
                    Vehículos actualmente en uso
                </small>

            </button>


            <!-- CONSULTAR MANTENIMIENTO -->

            <button
                type="button"
                class="action-btn"
                data-operacion="mantenimiento"
                aria-pressed="false"
                onclick="consultarMantenimiento()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-screwdriver-wrench"></i>
                </span>

                <span class="action-title">
                    Consultar Autos en Mantenimiento
                </span>

                <small>
                    Vehículos que se encuentran en taller
                </small>

            </button>


            <!-- ELIMINAR AUTO -->

            <button
                type="button"
                class="action-btn danger"
                data-operacion="eliminar"
                aria-pressed="false"
                onclick="mostrarEliminarAuto()">

                <span class="action-icon" aria-hidden="true">
                    <i class="fa-solid fa-trash-can"></i>
                </span>

                <span class="action-title">
                    Eliminar Auto
                </span>

                <small>
                    Dar de baja un vehículo registrado
                </small>

            </button>

        </div>


        <!-- PANEL DE OPERACIONES -->

        <div id="autosPanel"></div>

    `;

    // Actualizar consola JSON
    mostrarJSON({
        modulo: "Autos",
        estado: "Esperando operación"
    });

}

/* ===================================
    FORMULARIO DE CREACION DE AUTOS
=================================== */
function formCrearAuto(){

    seleccionarOperacion("crear");
    document.getElementById("autosPanel").innerHTML = `
        <section class="card operation-panel">
            <h3>🚘 Crear Auto</h3>
            <p class="form-description">Completa los datos del vehículo para registrarlo.</p>
            <div class="form-grid">
                <div class="form-field"><label for="placa">Placa <span>*</span></label><input id="placa" placeholder="Ej: ABC123" maxlength="15" autocomplete="off"></div>
                <div class="form-field"><label for="marca">Marca <span>*</span></label><input id="marca" placeholder="Ej: Toyota"></div>
                <div class="form-field"><label for="modelo">Modelo <span>*</span></label><input id="modelo" placeholder="Ej: Corolla"></div>
                <div class="form-field"><label for="anio">Año <span>*</span></label><input id="anio" type="number" min="1900" max="2100" placeholder="Ej: 2024"></div>
                <div class="form-field"><label for="precioPorDia">Precio por día <span>*</span></label><input id="precioPorDia" type="number" min="0" step="0.01" placeholder="Ej: 150000"></div>
            </div>
            <div id="autoMessage" aria-live="polite"></div>
            <div class="form-actions">
                <button type="button" class="btn-primary" onclick="crearAuto()">💾 Guardar Auto</button>
                <button type="button" class="btn-secondary" onclick="mostrarAutos()">Regresar</button>
            </div>
        </section>`;

}

/* ===================================
   CREACION Y ENVIO DE DATOS A GUARDAR DE AUTO CREADO
=================================== */
async function crearAuto() {

    const auto = {

        placa: document.getElementById(
            "placa"
        ).value,

        marca: document.getElementById(
            "marca"
        ).value,

        modelo: document.getElementById(
            "modelo"
        ).value,

        anio: parseInt(
            document.getElementById(
                "anio"
            ).value
        ),

        precioPorDia: parseFloat(
            document.getElementById(
                "precioPorDia"
            ).value
        )

    };

    try {

        const response = await fetch(
            "/api/autos",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(auto)
            }
        );

        const texto =
            await response.text();

        mostrarJSON({
            status: response.status,
            response: texto
        });

        if (response.ok) {

            document.getElementById(
                "autoMessage"
            ).innerHTML = `
            
            <div class="message-success">
                ✅ Auto creado correctamente.
            <br>
            </div>
            `;

            document.getElementById("placa").value = "";
            document.getElementById("marca").value = "";
            document.getElementById("modelo").value = "";
            document.getElementById("anio").value = "";
            document.getElementById("precioPorDia").value = "";

        } else {

             document.getElementById(
                "autoMessage"
            ).innerHTML = `

            <div class="message-error">
            ❌ ${texto}
            </div>
            `;

        }

    } catch (error) {

        mostrarJSON({
            error: error.message
        });

        alert(
            "Error al conectar con el servidor"
        );

    }

}

/* ===================================
    CONSULTA DE LOS AUTOS
=================================== */
async function consultarAutosEndpoint(
        endpoint,
        titulo,
        panelId = "autosPanel"){

    try{

        const response =
            await fetch(endpoint);

        const texto =
            await response.text();

        const panel =
            document.getElementById(panelId);

        if(!panel){
            mostrarJSON({
                error:
                `No existe el contenedor ${panelId}`
            });

            return;
        }

        if(!response.ok){

            panel.innerHTML = `

                <div class="card">

                    <div class="message-error">

                        ❌ ${texto}

                    </div>

                </div>

            `;

            mostrarJSON({

                status:
                    response.status,

                response:
                    texto

            });

            return;
        }

        const data =
            JSON.parse(texto);

        mostrarJSON(data);

        generarCardsAutos(
            data,
            titulo,
            panelId
        );

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

    }

}

/* ==========================================
   CONSULTAR AUTOS EN TOTAL
========================================== */
async function consultarTodosAutos(){
    seleccionarOperacion("todos");
    
    await consultarAutosEndpoint(
        "/api/autos",
        "Todos los Autos",
        
    );

}

/* ==========================================
   CONSULTAR AUTO EN DISPONIBLE
========================================== */
async function consultarDisponibles(){
    seleccionarOperacion("disponibles");

    await consultarAutosEndpoint(
        "/api/autos/disponibles",
        "Autos Disponibles"
    );

}

/* ==========================================
   CONSULTAR AUTO EN ALQUILER
========================================== */
async function consultarAlquilados(){
    seleccionarOperacion("alquilados");

    await consultarAutosEndpoint(
        "/api/autos/alquilados",
        "Autos Alquilados"
    );

}

/* ==========================================
   CONSULTAR AUTO EN MANTENIMIENTO
========================================== */
async function consultarMantenimiento(){
    seleccionarOperacion("mantenimiento");

    await consultarAutosEndpoint(
        "/api/autos/mantenimiento",
        "Autos en Mantenimiento"
    );
}

/* ==========================================
    MOSTRAR FORMULARIO PARA ELIMINAR AUTO POR ID
========================================== */
function mostrarEliminarAuto(){
    seleccionarOperacion("eliminar");

    document.getElementById(
        "autosPanel"
    ).innerHTML = `

        <div class="card">
            <h3>
                Eliminar Auto
            </h3>

            <div class="form-grid">

                <input
                    id="autoIdEliminar"
                    type="number"
                    placeholder="ID del Auto">

            </div>

            <div id="autoDeleteMessage"></div>

            <button
                class="btn-danger"
                onclick="eliminarAuto()">

                Eliminar Auto

            </button>

        </div>

    `;

}

/* ==========================================
    FUNCION PARA ELIMINAR AUTO POR ID
========================================== */
async function eliminarAuto(){

    const id =
        document.getElementById(
            "autoIdEliminar"
        ).value;

    if(!id){

        document.getElementById(
            "autoDeleteMessage"
        ).innerHTML = `

            <div class="message-error">

                ❌ Debe ingresar el ID del auto

            </div>

        `;

        return;
    }

    try {

        const response =
            await fetch(
                "/api/autos/" + id,
                {
                    method: "DELETE"
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

        document.getElementById(
            "autoDeleteMessage"
        ).innerHTML = `

            <div class="message-success">
            
                ✅ ${texto}

            </div>

        `;

            setTimeout(() => {

                consultarTodosAutos();

            }, 1500);

        }
        else{

            document.getElementById(
                "autoDeleteMessage"
            ).innerHTML = `

                <div class="message-error">

                    ❌ ${texto}

                </div>

            `;

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

    }

}

/* ===================================
    MODO DE PRESENTACION PARA AUTOS (CARTAS)
=================================== */
function generarCardsAutos(
    autos,
    titulo,
    panelId) {

    let cards = "";

    autos.forEach(auto => {

        let estadoClass =
            "estado-disponible";

        if (auto.estado === "ALQUILADO") {
            estadoClass =
                "estado-alquilado";
        }

        if (auto.estado === "MANTENIMIENTO") {
            estadoClass =
                "estado-mantenimiento";
        }

        cards += `

            <div class="auto-card">

                <div class="auto-header">

                    <div class="auto-icon">
                        🚗
                    </div>

                    <div class="auto-title">

                        <h3>${escaparHTML(auto.placa)}</h3>

                        <span>
                            ID #${escaparHTML(auto.id)}
                        </span>

                    </div>

                </div>

                <div class="auto-body">

                    <div class="auto-info">
                        <strong>Marca</strong>
                        <span>${escaparHTML(auto.marca)}</span>
                    </div>

                    <div class="auto-info">
                        <strong>Modelo</strong>
                        <span>${escaparHTML(auto.modelo)}</span>
                    </div>

                    <div class="auto-info">
                        <strong>Año</strong>
                        <span>${escaparHTML(auto.anio)}</span>
                    </div>

                    <div class="auto-info">
                        <strong>Precio/Día</strong>
                        <span>$${escaparHTML(auto.precioPorDia)}</span>
                    </div>

                    <div class="auto-info">
                        <strong>Kilometraje</strong>
                        <span>${escaparHTML(auto.kilometraje ?? 0)} km</span>
                    </div>

                </div>

                <div class="estado ${estadoClass}">
                    ${escaparHTML(auto.estado)}
                </div>

            </div>

        `;
    });

    document.getElementById(
        panelId
    ).innerHTML = `

        <div class="card">

            <h3>
                ${titulo}
            </h3>

            <div class="autos-grid">

                ${cards}

            </div>

        </div>

    `;
}

/* ===================================
   OPCIONES DE GESTION DE LOS CLIENTES
=================================== */
function mostrarClientes() {

    activarMenu("clientes");

    workspace.innerHTML = `

        <div class="module-header">

            <h2>Gestión de Clientes</h2>

            <p>
                Administra la información de los clientes
                registrados en AutoRent.
            </p>

        </div>

        <div class="module-grid">

            <button
                class="action-btn"
                onclick="formCrearCliente()">

                <span class="action-icon">
                    ➕
                </span>

                <strong>Crear Cliente</strong>

                <small>Registrar nuevo cliente</small>

            </button>

            <button
                class="action-btn"
                onclick="consultarTodosClientes()">

                <span class="action-icon">
                    👥
                </span>

                <strong>Consultar Todos los Clientes</strong>

                <small>Ver clientes registrados</small>

            </button>

            <button
                class="action-btn"
                onclick="formBuscarCliente()">

                <span class="action-icon">
                    🔍
                </span>

                <strong>Buscar Cliente</strong>

                <small>Consultar por identificación</small>

            </button>

            <button
                class="action-btn"
                onclick="formActualizarCliente()">

                <span class="action-icon">
                    ✏️
                </span>

                <strong>Actualizar Cliente</strong>

                <small>Modificar información</small>

            </button>

            <button
                class="action-btn danger"
                onclick="formEliminarCliente()">

                <span class="action-icon">
                    🗑️
                </span>

                <strong>Eliminar Cliente</strong>

                <small>Dar de baja un cliente</small>

            </button>

        </div>

        <div id="clientesPanel"></div>

    `;

    mostrarJSON({
        modulo: "Clientes",
        estado: "Esperando operación"
    });

}

/* ===================================
    FORMULARIO DE CREACION DE CLIENTES
=================================== */
function formCrearCliente(){

    document.getElementById(
        "clientesPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                👤 Registrar Nuevo Cliente
            </h3>

            <p class="form-description">Completa los datos del cliente para registrarlo.</p>

            <div class="form-grid">

                <div class="form-group">

                    <label for="clienteNombre">

                        Nombre <span>*</span>

                    </label>

                    <input
                        id="clienteNombre"
                        type="text"
                        placeholder="Nombre completo">

                </div>

                <div class="form-group">

                    <label for="clienteDocumento">

                        Documento <span>*</span>

                    </label>

                    <input
                        id="clienteDocumento"
                        type="text"
                        placeholder="Número de documento">

                </div>

                <div class="form-group">

                    <label for="clienteTelefono">

                        Teléfono <span>*</span>

                    </label>

                    <input
                        id="clienteTelefono"
                        type="tel"
                        placeholder="Número de teléfono">

                </div>

                <div class="form-group">

                    <label for="clienteEmail">

                        Correo Electrónico <span>*</span>

                    </label>

                    <input
                        id="clienteEmail"
                        type="email"
                        placeholder="Correo electrónico">

                </div>

            </div>

            <div id="clienteMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="crearCliente()">

                    💾 Guardar Cliente

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarClientes()">

                    Regresar

                </button>

            </div>

        </div>

    `;

}

/* ===================================
   CREACION Y ENVIO DE DATOS A GUARDAR DE CLIENTE CREADO
=================================== */
async function crearCliente(){

    const cliente = {

        nombre:
            document.getElementById(
                "clienteNombre"
            ).value,

        documento:
            document.getElementById(
                "clienteDocumento"
            ).value,

        telefono:
            document.getElementById(
                "clienteTelefono"
            ).value,

        email:
            document.getElementById(
                "clienteEmail"
            ).value

    };

    try{

        const response =
            await fetch(
                "/api/clientes",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(cliente)
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            document.getElementById(
                "clienteMessage"
            ).innerHTML = `

                <div class="message-success">

                    ✅ Cliente creado correctamente.

                </div>

            `;

            document.getElementById(
                "clienteNombre"
            ).value = "";

            document.getElementById(
                "clienteDocumento"
            ).value = "";

            document.getElementById(
                "clienteTelefono"
            ).value = "";

            document.getElementById(
                "clienteEmail"
            ).value = "";

        } else {

            document.getElementById(
                "clienteMessage"
            ).innerHTML = `

                <div class="message-error">

                    ❌ ${texto}

                </div>

            `;

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

        document.getElementById(
            "clienteMessage"
        ).innerHTML = `

            <div class="message-error">

                ❌ ${error.message}

            </div>

        `;

    }

}

/* ===================================
    CONSULTA DE LOS CLIENTES
=================================== */
async function consultarClientesEndpoint(endpoint, titulo) {

    const panel = document.getElementById("clientesPanel");

    if (!panel) return;

    try {

        const response = await fetch(endpoint);

        const texto = await response.text();

        // RESPUESTA CON ERROR DEL BACKEND

        if (!response.ok) {

            panel.innerHTML = `

                <div class="card">

                    <div class="message-error">

                        ❌ ${escaparHTML(texto)}

                    </div>

                </div>

            `;

            mostrarJSON({
                status: response.status,
                response: texto
            });

            return;
        }

        // RESPUESTA EXITOSA

        const data = JSON.parse(texto);

        mostrarJSON(data);

        const clientes = Array.isArray(data)
            ? data
            : [data];

        generarCardsClientes(clientes, titulo);

    } catch (error) {

        panel.innerHTML = `

            <div class="card">

                <div class="message-error">

                    ❌ ${escaparHTML(error.message)}

                </div>

            </div>

        `;

        mostrarJSON({
            modulo: "Clientes",
            error: error.message
        });

    }
}

/* ==========================================
   CONSULTAR TODOS LOS CLIENTES
========================================== */
async function consultarTodosClientes() {

    seleccionarOperacion("todos");

    await consultarClientesEndpoint(
        "/api/clientes",
        "Todos los Clientes"
    );

}

/* ==========================================
   FORMULARIO PARA BUSCAR CLIENTE POR ID
========================================== */
function formBuscarCliente() {

    seleccionarOperacion("buscar");

    document.getElementById("clientesPanel").innerHTML = `

        <div class="card operation-panel">

            <h3>🔍 Buscar Cliente por ID</h3>

            <p class="form-description">
                Ingresa el ID del cliente que deseas consultar.
            </p>

            <div class="form-grid">

                <div class="form-field">

                    <label for="clienteIdBuscar">
                        ID del Cliente
                    </label>

                    <input
                        id="clienteIdBuscar"
                        type="number"
                        min="1"
                        placeholder="Ej: 1">

                </div>

            </div>

            <div id="clienteBuscarMessage"></div>

            <div id="clienteBuscarResultado"></div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn-primary"
                    onclick="consultarClientePorID()">

                    Buscar Cliente

                </button>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarClientes()">

                    Regresar

                </button>

            </div>

        </div>

    `;
}

/* ==========================================
   CONSULTAR CLIENTE POR ID
========================================== */
async function consultarClientePorID(){

    const id =
        document.getElementById(
            "clienteIdBuscar"
        ).value;

    if(!id){

        mostrarMensaje(
            "clienteBuscarMessage",
            "error",
            "Debe ingresar el ID del cliente"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/clientes/" + id
            );

        const texto =
            await response.text();

        if(!response.ok){

            mostrarMensaje(
                "clienteBuscarMessage",
                "error",
                texto
            );

            document.getElementById(
                "clienteBuscarResultado"
            ).innerHTML = "";

            return;
        }

        const cliente =
            JSON.parse(texto);

        mostrarMensaje(
            "clienteBuscarMessage",
            "success",
            "Cliente encontrado"
        );

        document.getElementById(
            "clienteBuscarResultado"
        ).innerHTML = `

            <div class="clientes-grid">

                <div class="cliente-card">

                    <div class="cliente-header">

                        <div class="cliente-icon">
                            👤
                        </div>

                        <div class="cliente-title">

                            <h3>
                                ${cliente.nombre}
                            </h3>

                            <span>
                                ID #${cliente.id}
                            </span>

                        </div>

                    </div>

                    <div class="cliente-body">

                        <div class="cliente-info">

                            <strong>
                                Documento
                            </strong>

                            <span>
                                ${cliente.documento}
                            </span>

                        </div>

                        <div class="cliente-info">

                            <strong>
                                Teléfono
                            </strong>

                            <span>
                                ${cliente.telefono}
                            </span>

                        </div>

                        <div class="cliente-info">

                            <strong>
                                Correo
                            </strong>

                            <span>
                                ${cliente.email}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }
    catch(error){

        mostrarMensaje(
            "clienteBuscarMessage",
            "error",
            error.message
        );

    }

}

/* ===================================
    FORMULARIO DE ACTUALIZAR CLIENTES
=================================== */
function formActualizarCliente(){

    document.getElementById(
        "clientesPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                Actualizar Cliente
            </h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        ID Cliente
                    </label>

                    <input
                        id="clienteIdActualizar"
                        type="number"
                        placeholder="Ingrese el ID">

                </div>

            </div>

            <div id="clienteActualizarMessage"></div>

            <div id="clienteActualizarFormulario"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="buscarClienteActualizar()">

                    Buscar Cliente

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarClientes()">

                    Regresar

                </button>

            </div>

        </div>

    `;

}

/* ==========================================
   CONSULTAR CLIENTE POR ID PARA ACTUALIZAR
========================================== */
async function buscarClienteActualizar(){

    const id =
        document.getElementById(
            "clienteIdActualizar"
        ).value;

    if(!id){

        mostrarMensaje(
            "clienteActualizarMessage",
            "error",
            "Debe ingresar el ID del cliente"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/clientes/" + id
            );

        const texto =
            await response.text();

        if(!response.ok){

            mostrarMensaje(
                "clienteActualizarMessage",
                "error",
                texto
            );

            return;
        }

        const cliente =
            JSON.parse(texto);

        document.getElementById(
            "clienteActualizarFormulario"
        ).innerHTML = `

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        Nombre
                    </label>

                    <input
                        id="updateNombre"
                        value="${escaparHTML(cliente.nombre)}">

                </div>

                <div class="form-group">

                    <label>
                        Documento
                    </label>

                    <input
                        id="updateDocumento"
                        value="${escaparHTML(cliente.documento)}"
                        readonly>

                </div>

                <div class="form-group">

                    <label>
                        Teléfono
                    </label>

                    <input
                        id="updateTelefono"
                        value="${escaparHTML(cliente.telefono)}">

                </div>

                <div class="form-group">

                    <label>
                        Email
                    </label>

                    <input
                        id="updateEmail"
                        value="${escaparHTML(cliente.email)}">

                </div>

            </div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="actualizarCliente(${cliente.id})">

                    Guardar Cambios

                </button>

            </div>

        `;

        mostrarMensaje(
            "clienteActualizarMessage",
            "success",
            "Cliente encontrado"
        );

    }
    catch(error){

        mostrarMensaje(
            "clienteActualizarMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
    METODO PARA GUARDAR LOS CAMBIOS ACTUALIZADOS
========================================== */
async function actualizarCliente(id){

    const cliente = {

        nombre:
            document.getElementById(
                "updateNombre"
            ).value,

        telefono:
            document.getElementById(
                "updateTelefono"
            ).value,

        documento:
            document.getElementById(
                "updateDocumento"
            ).value,

        email:
            document.getElementById(
                "updateEmail"
            ).value

    };

    try{

        const response =
            await fetch(
                "/api/clientes/" + id,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(cliente)
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            mostrarMensaje(
                "clienteActualizarMessage",
                "success",
                "Cliente actualizado correctamente"
            );

        }else{

            mostrarMensaje(
                "clienteActualizarMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarMensaje(
            "clienteActualizarMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
    MOSTRAR FORMULARIO PARA ELIMINAR CLIENTE POR ID
========================================== */
function formEliminarCliente(){

    document.getElementById(
        "clientesPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                Eliminar Cliente
            </h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        ID Cliente
                    </label>

                    <input
                        id="clienteIdEliminar"
                        type="number"
                        min="1"
                        placeholder="Ingrese el ID">

                </div>

            </div>

            <div id="clienteEliminarMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-danger"
                    onclick="eliminarCliente()">

                    🗑 Eliminar Cliente

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarClientes()">

                    Regresar

                </button>

            </div>

        </div>

    `;
}

/* ==========================================
    FUNCION PARA ELIMINAR CLIENTE POR ID
========================================== */
async function eliminarCliente(){

    const id =
        document.getElementById(
            "clienteIdEliminar"
        ).value;

    if(!id){

        mostrarMensaje(
            "clienteEliminarMessage",
            "error",
            "Debe ingresar el ID del cliente"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/clientes/" + id,
                {
                    method:"DELETE"
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            mostrarMensaje(
                "clienteEliminarMessage",
                "success",
                texto
            );

            setTimeout(() => {

                consultarTodosClientes();

            }, 1500);

        }else{

            mostrarMensaje(
                "clienteEliminarMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

    }

}

/* ===================================
    MODO DE PRESENTACION PARA CLIENTES (CARTAS)
=================================== */
function generarCardsClientes(clientes, titulo = "Clientes Registrados") {

    const panel = document.getElementById("clientesPanel");

    if (!panel) return;

    // Aceptar tanto una lista como un solo cliente
    const listaClientes = Array.isArray(clientes)
        ? clientes
        : [clientes];

    // Si no hay datos, no inventamos mensajes del backend
    if (listaClientes.length === 0 || !listaClientes[0]) {
        panel.innerHTML = "";
        return;
    }

    // Generar tarjetas de clientes
    let cards = "";

    listaClientes.forEach(cliente => {

        cards += `

            <div class="cliente-card">

                <!-- ENCABEZADO -->

                <div class="cliente-header">

                    <div class="cliente-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="cliente-title">

                        <h3>
                            ${escaparHTML(
                                [cliente.nombre, cliente.apellido]
                                    .filter(Boolean)
                                    .join(" ") || "Sin nombre"
                            )}
                        </h3>

                        <span>
                            ID #${escaparHTML(cliente.id ?? "N/D")}
                        </span>

                    </div>

                </div>


                <!-- INFORMACIÓN DEL CLIENTE -->

                <div class="cliente-body">

                    <div class="cliente-info">

                        <strong>Documento</strong>

                        <span>
                            ${escaparHTML(cliente.documento ?? "N/D")}
                        </span>

                    </div>


                    <div class="cliente-info">

                        <strong>Teléfono</strong>

                        <span>
                            ${escaparHTML(cliente.telefono ?? "No registrado")}
                        </span>

                    </div>


                    <div class="cliente-info">

                        <strong>Correo electrónico</strong>

                        <span>
                            ${escaparHTML(cliente.email ?? "No registrado")}
                        </span>

                    </div>

                </div>

            </div>

        `;

    });


    // Mostrar las tarjetas en el panel de Clientes

    panel.innerHTML = `

        <div class="card">

            <h3>
                ${escaparHTML(titulo)} (${listaClientes.length})
            </h3>

            <div class="clientes-grid">

                ${cards}

            </div>

        </div>

    `;

}

/* ===================================
   OPCIONES DE GESTION DE LOS ALQUILERES
=================================== */
function mostrarAlquileres() {

    activarMenu("alquileres");

    workspace.innerHTML = `

        <div class="module-header">

            <h2>Gestión de Alquileres</h2>

            <p>
                Administra los alquileres, pagos
                y devoluciones de vehículos.
            </p>

        </div>

        <div class="module-grid">

            <button class="action-btn" onclick="formCrearAlquiler()">

                <span class="action-icon">➕</span>

                <strong>Crear Alquiler</strong>

                <small>Registrar un nuevo alquiler</small>

            </button>

            <button class="action-btn" onclick="formRegistrarPago()">

                <span class="action-icon">💳</span>

                <strong>Registrar Pago</strong>

                <small>Gestionar pagos de alquileres</small>

            </button>

            <button class="action-btn" onclick="formFinalizarAlquiler()">

                <span class="action-icon">✅</span>

                <strong>Finalizar Alquiler</strong>

                <small>Registrar devolución del vehículo</small>

            </button>

            <button class="action-btn" onclick="formFinalizacionAnticipada()">

                <span class="action-icon">⏱️</span>

                <strong>Finalización Anticipada</strong>

                <small>Finalizar antes de la fecha prevista</small>

            </button>

            <button class="action-btn" onclick="consultarTodosAlquileres()">

                <span class="action-icon">📋</span>

                <strong>Consultar Todos</strong>

                <small>Ver historial de alquileres</small>

            </button>

            <button class="action-btn" onclick="consultarAlquileresActivos()">

                <span class="action-icon">🚘</span>

                <strong>Alquileres Activos</strong>

                <small>Vehículos actualmente alquilados</small>

            </button>

            <button class="action-btn" onclick="consultarAlquileresFinalizados()">

                <span class="action-icon">📁</span>

                <strong>Alquileres Finalizados</strong>

                <small>Consultar alquileres completados</small>

            </button>

        </div>

        <div id="alquileresPanel"></div>

    `;

    mostrarJSON({
        modulo: "Alquileres",
        estado: "Esperando operación"
    });

}

/* ===================================
    FORMULARIO DE CREACION DE ALQUILERES
=================================== */
function formCrearAlquiler(){

    document.getElementById(
        "alquileresPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                Crear Alquiler
            </h3>

            <p class="form-description">
                Complete los datos para crear un nuevo alquiler.
            </p>

            <div class="form-grid">

                <div class="form-group">

                    <label for="alquilerClienteId">

                        ID Cliente <span>*</span>

                    </label>

                    <input
                        id="alquilerClienteId"
                        type="number"
                        min="1"
                        placeholder="Ingrese ID del cliente">

                </div>

                <div class="form-group">

                    <label for="alquilerAutoId">

                        ID Auto <span>*</span>

                    </label>

                    <input
                        id="alquilerAutoId"
                        type="number"
                        min="1"
                        placeholder="Ingrese ID del auto">

                </div>

                <div class="form-group">

                    <label for="alquilerCantidadDias">

                        Cantidad de Dias <span>*</span>

                    </label>

                    <input
                        id="alquilerCantidadDias"
                        type="number"
                        min="1"
                        placeholder="Ej: 5">

                </div>

            </div>

            <div id="alquilerMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="crearAlquiler()">

                    💾 Crear Alquiler

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarAlquileres()">

                    Regresar

                </button>

            </div>

            <br>
            <div id="clientesDisponibles"></div>
            <div id="autosDisponibles"></div>

        </div>

    `;
    
    cargarAutosParaAlquiler();
    cargarClientesParaAlquiler();    
}

/* ===================================
    CARGA DE CLIENTES REGISTRADOS
=================================== */
async function cargarClientesParaAlquiler(){

    const response =
        await fetch("/api/clientes");

    const texto =
        await response.text();

    if(!response.ok){

        document.getElementById(
            "clientesDisponibles"
        ).innerHTML = `
            <div class="message-error">
                ❌ ${texto}
            </div>
        `;

        return;
    }

    const clientes =
        JSON.parse(texto);

    let html = `

        <div class="alquiler-selector-card">

            <div class="alquiler-title">

                <div class="alquiler-title-icon">
                    👥
                </div>

                <div>

                    <h4>
                        Clientes Registrados
                    </h4>

                    <p>
                        Seleccione el ID del cliente para el alquiler.
                    </p>

                </div>

            </div>

            <div class="alquiler-clientes-grid">

    `;

    clientes.forEach(cliente => {

        html += `

            <div class="alquiler-cliente-card">

                <div class="alquiler-mini-icon">

                    👤

                </div>

                <div class="alquiler-card-center">

                    <div class="alquiler-data-row">

                        <strong>Nombre</strong>

                        <span>${cliente.nombre}</span>

                    </div>

                    <div class="alquiler-data-row">

                        <strong>Documento</strong>

                        <span>${cliente.documento}</span>

                    </div>

                    <div class="alquiler-data-row">

                        <strong>Teléfono</strong>

                        <span>${cliente.telefono}</span>

                    </div>

                </div>

                <div class="alquiler-card-right">

                    <div class="alquiler-mini-badge">

                        ID #${cliente.id}

                    </div>

                </div>

            </div>

        `;

    });

    html += `

            </div>

        </div>

    `;

    document.getElementById(
        "clientesDisponibles"
    ).innerHTML = html;

}

/* ===================================
    CARGA DE AUTOS REGISTRADOS
=================================== */
async function cargarAutosParaAlquiler(){

    const response =
        await fetch("/api/autos");

    const texto =
        await response.text();

    if(!response.ok){

        document.getElementById(
            "autosDisponibles"
        ).innerHTML = `
            <div class="message-error">
                ❌ ${texto}
            </div>
        `;

        return;
    }

    const autos =
        JSON.parse(texto);

    let html = `

        <div class="alquiler-selector-card">

            <div class="alquiler-title">

                <div class="alquiler-title-icon">
                    🚗
                </div>

                <div>

                    <h4>
                        Vehículos Registrados
                    </h4>

                    <p>
                        Seleccione el ID del auto para el alquiler.
                    </p>
                    <p>
                        Solo se pueden alquilar vehículos DISPONIBLES.
                    </p>

                </div>

            </div>

            <div class="alquiler-autos-grid">

    `;

    autos.forEach(auto => {

        let estadoClass =
            "alquiler-estado-disponible";

        if(auto.estado === "ALQUILADO"){

            estadoClass =
                "alquiler-estado-alquilado";
        }

        if(auto.estado === "MANTENIMIENTO"){

            estadoClass =
                "alquiler-estado-mantenimiento";
        }

        html += `

            <div class="alquiler-auto-card">

                <div class="alquiler-mini-icon">

                    🚗

                </div>

                <div class="alquiler-card-center">

                    <div class="alquiler-data-row">

                        <strong>Placa</strong>

                        <span>${auto.placa}</span>

                    </div>

                    <div class="alquiler-data-row">

                        <strong>Vehículo</strong>

                        <span>
                            ${auto.marca}
                            |
                            ${auto.modelo}
                            |
                            ${auto.anio}
                        </span>

                    </div>

                    <div class="alquiler-data-row">

                        <strong>Valor Día</strong>

                        <span>

                            $${auto.precioPorDia}

                        </span>

                    </div>

                </div>

                <div class="alquiler-card-right">

                    <div class="alquiler-mini-badge">

                        ID #${auto.id}

                    </div>

                    <div class="alquiler-estado ${estadoClass}">

                        ${auto.estado}

                    </div>

                </div>

            </div>

        `;

    });

    html += `

            </div>

        </div>

    `;

    document.getElementById(
        "autosDisponibles"
    ).innerHTML = html;

}

/* ===================================
   CREACION Y ENVIO DE DATOS A GUARDAR DE ALQUILER CREADO
=================================== */
async function crearAlquiler(){

    const alquiler = {

        clienteId:
            parseInt(
                document.getElementById(
                    "alquilerClienteId"
                ).value
            ),

        autoId:
            parseInt(
                document.getElementById(
                    "alquilerAutoId"
                ).value
            ),

        cantidadDias:
            parseInt(
                document.getElementById(
                    "alquilerCantidadDias"
                ).value
            )

    };

    if (!alquiler.clienteId){
        
        mostrarMensaje(
            "alquilerMessage",
            "error",
            "Debe seleccionar un Cliente ID"
        );
        
        return;
    }

    if (!alquiler.autoId){

        mostrarMensaje(
            "alquilerMessage",
            "error",
            "Debe seleccionar un Auto ID"
        );

        return;
    }

    if (!alquiler.cantidadDias){

        mostrarMensaje(
            "alquilerMessage",
            "error",
            "Debe indicar la cantidad de días"
        );

        return;
    }

    try {

        const response =
            await fetch(
                "/api/alquileres",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(alquiler)
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            mostrarMensaje(
                "alquilerMessage",
                "success",
                "Alquiler creado correctamente"
            );

            document.getElementById(
                "alquilerClienteId"
            ).value = "";

            document.getElementById(
                "alquilerAutoId"
            ).value = "";

            document.getElementById(
                "alquilerCantidadDias"
            ).value = "";

        } else {

            mostrarMensaje(
                "alquilerMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

        mostrarMensaje(
            "alquilerMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
    FUNCION PARA MOSTRAR ALQUILERES ACTIVOS E INFORMACION DEL MISMO
========================================== */
async function cargarResumenAlquileresActivos(){

    const contenedor =
        document.getElementById(
            "alquileresActivosPreview"
        );

    if(!contenedor) return;

    try{

        const response =
            await fetch(
                "/api/alquileres/activos"
            );

        const texto =
            await response.text();

        if(!response.ok){

            contenedor.innerHTML = `

                <div class="message-error">

                    ❌ ${texto}

                </div>

            `;

            mostrarJSON({

                status:
                    response.status,

                response:
                    texto

            });

            return;
        }

        const alquileres =
            JSON.parse(texto);

        if(!alquileres.length){

            contenedor.innerHTML = `

                <div class="message-error">

                    ❌ No existen actualmente alquileres activos.

                </div>

            `;

            return;
        }

        let html = `

            <div class="alquiler-resumen-wrapper">

                <h4>
                    📋 Alquileres Activos
                </h4>

                <div class="alquiler-resumen-grid">

        `;

        alquileres.forEach(alquiler => {

            const saldo =
                alquiler.valorTotal -
                alquiler.valorPagado;

            html += `

                <div class="alquiler-resumen-card">

                    <div class="alquiler-resumen-header">

                        <div class="alquiler-resumen-icon">
                            📄
                        </div>

                        <div class="alquiler-resumen-title">

                            Alquiler #${alquiler.id}

                        </div>

                        <div class="alquiler-resumen-estado">

                            ${alquiler.estado}

                        </div>

                    </div>

                    <div class="alquiler-resumen-body">

                        <div>

                            <strong>Cliente:</strong>
                            ${alquiler.clienteId}

                        </div>

                        <div>

                            <strong>Auto:</strong>
                            ${alquiler.autoId}

                        </div>

                        <div>

                            <strong>Días Contratados:</strong>
                            ${alquiler.cantidadDias}

                        </div>

                        <div>

                            <strong>Días utilizados:</strong>
                            ${alquiler.diasUtilizados ?? alquiler.cantidadDias}

                        </div>

                        <div>

                            <strong>Total:</strong>
                            $${alquiler.valorTotal}

                        </div>

                        <div>

                            <strong>Pagado:</strong>
                            $${alquiler.valorPagado}

                        </div>

                        <div>

                            <strong>Saldo:</strong>
                            $${saldo}

                        </div>

                    </div>

                </div>

            `;

        });

        html += `

                </div>

            </div>

        `;

        contenedor.innerHTML = html;

    }
    catch(error){

        mostrarJSON({
            error:error.message
        });

    }

}

/* ===================================
    FORMULARIO DE PAGO DE ALQUILERES
=================================== */
function formRegistrarPago(){

    document.getElementById(
        "alquileresPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                Registrar Pago
            </h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        ID Alquiler
                    </label>

                    <input
                        id="alquilerPagoId"
                        type="number"
                        min="1"
                        placeholder="Ingrese ID del alquiler">

                </div>

                <div class="form-group">

                    <label>
                        Valor a Pagar
                    </label>

                    <input
                        id="valorPago"
                        type="number"
                        min="1"
                        placeholder="Ej: 200000">

                </div>

            </div>

            <div id="pagoMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="registrarPago()">

                    💳 Registrar Pago

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarAlquileres()">

                    Regresar

                </button>

            </div>

            <div id="alquileresActivosPreview"></div>

        </div>

    `;

    cargarResumenAlquileresActivos();

}

/* ==========================================
    FUNCION PARA REGISTRAR EL PAGO
========================================== */
async function registrarPago(){

    const alquilerId =
        document.getElementById(
            "alquilerPagoId"
        ).value;

    const valorPago =
        document.getElementById(
            "valorPago"
        ).value;

    if(!alquilerId){

        mostrarMensaje(
            "pagoMessage",
            "error",
            "Debe indicar el ID del alquiler"
        );

        return;
    }

    if(!valorPago){

        mostrarMensaje(
            "pagoMessage",
            "error",
            "Debe indicar el valor del pago"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/alquileres/" +
                alquilerId +
                "/pagar",
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            valorPago:
                                Number(valorPago)
                        })
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            const alquiler =
                JSON.parse(texto);

            const saldoPendiente =
                alquiler.valorTotal -
                alquiler.valorPagado;

            let mensaje = "";

            if(saldoPendiente > 0){

                mensaje = `
                    Pago registrado correctamente al alquiler #${alquiler.id}.
                    Valor abonado: $${valorPago} 💰.
                    Saldo pendiente: $${saldoPendiente} 📊.
                `;

            }else{

                mensaje = `
                    Pago registrado correctamente al alquiler #${alquiler.id}.
                    El alquiler se encuentra totalmente pago.
                `;

            }

            mostrarMensaje(
                "pagoMessage",
                "success",
                mensaje
            );

            document.getElementById(
                "alquilerPagoId"
            ).value = "";

            document.getElementById(
                "valorPago"
            ).value = "";

        }else{

            mostrarMensaje(
                "pagoMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

        mostrarMensaje(
            "pagoMessage",
            "error",
            error.message
        );

    }

}

/* ===================================
    FORMULARIO DE FINALIZAR ALQUILER
=================================== */
function formFinalizarAlquiler(){

    document.getElementById(
        "alquileresPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                ✅ Finalizar Alquiler
            </h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        ID Alquiler
                    </label>

                    <input
                        id="alquilerFinalizarId"
                        type="number"
                        min="1"
                        placeholder="Ingrese ID del alquiler">

                </div>

            </div>

            <div id="finalizarAlquilerMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="finalizarAlquiler()">

                    ✅ Finalizar

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarAlquileres()">

                    Regresar

                </button>

            </div>

            <div id="alquileresActivosPreview"></div>

        </div>

    `;

    cargarResumenAlquileresActivos();

}

/* ==========================================
    FUNCION PARA FINALIZAR ALQUILER POR ID
========================================== */
async function finalizarAlquiler(){

    const id =
        document.getElementById(
            "alquilerFinalizarId"
        ).value;

    if(!id){

        mostrarMensaje(
            "finalizarAlquilerMessage",
            "error",
            "Debe ingresar el ID del alquiler"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/alquileres/" +
                id +
                "/finalizar",
                {
                    method:"PUT"
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            mostrarMensaje(
                "finalizarAlquilerMessage",
                "success",
                "Alquiler finalizado correctamente"
            );

            document.getElementById(
                "alquilerFinalizarId"
            ).value = "";

        }
        else{

            mostrarMensaje(
                "finalizarAlquilerMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

        mostrarMensaje(
            "finalizarAlquilerMessage",
            "error",
            error.message
        );

    }

}

/* ===================================
    FORMULARIO DE FINALIZAR ALQUILER DE FORMA ANTICIPADA
=================================== */
function formFinalizacionAnticipada(){

    document.getElementById(
        "alquileresPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                ⏱️ Finalización Anticipada
            </h3>

            <div class="form-grid">

                <div class="form-group">

                    <label>
                        ID del Alquiler
                    </label>

                    <input
                        id="alquilerAnticipadoId"
                        type="number"
                        min="1"
                        placeholder="Ingrese ID del alquiler">

                </div>

                <div class="form-group">

                    <label>
                        Días Utilizados
                    </label>

                    <input
                        id="diasUtilizados"
                        type="number"
                        min="1"
                        placeholder="Ej: 3">

                </div>

            </div>

            <div id="finalizacionAnticipadaMessage"></div>

            <div class="form-actions">

                <button
                    class="btn-primary"
                    onclick="finalizarAnticipadamente()">

                    ⏱️ Finalizar Anticipadamente

                </button>

                <button
                    class="btn-secondary"
                    onclick="mostrarAlquileres()">

                    Regresar

                </button>

            </div>

            <div id="alquileresActivosPreview"></div>

        </div>

    `;
    
    cargarResumenAlquileresActivos();

}

/* ==========================================
    FUNCION PARA FINALIZAR ALQUILER POR ID DE FORMA ANTICIPADA
========================================== */
async function finalizarAnticipadamente(){

    const alquilerId =
        document.getElementById(
            "alquilerAnticipadoId"
        ).value;

    const diasUtilizados =
        document.getElementById(
            "diasUtilizados"
        ).value;

    if(!alquilerId){

        mostrarMensaje(
            "finalizacionAnticipadaMessage",
            "error",
            "Debe ingresar el ID del alquiler"
        );

        return;
    }

    if(!diasUtilizados){

        mostrarMensaje(
            "finalizacionAnticipadaMessage",
            "error",
            "Debe ingresar los días utilizados"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/alquileres/" +
                alquilerId +
                "/finalizar-anticipado",
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            diasUtilizados:
                                Number(diasUtilizados)
                        })
                }
            );

        const texto =
            await response.text();

        mostrarJSON({

            status:
                response.status,

            response:
                texto

        });

        if(response.ok){

            mostrarMensaje(
                "finalizacionAnticipadaMessage",
                "success",
                "Alquiler finalizado anticipadamente"
            );

            document.getElementById(
                "alquilerAnticipadoId"
            ).value = "";

            document.getElementById(
                "diasUtilizados"
            ).value = "";

        }
        else{

            mostrarMensaje(
                "finalizacionAnticipadaMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarJSON({

            error:
                error.message

        });

        mostrarMensaje(
            "finalizacionAnticipadaMessage",
            "error",
            error.message
        );

    }

}

/* ===================================
    CONSULTA DE LOS ALQUILERES
=================================== */
async function consultarAlquileresEndpoint(
        endpoint,
        titulo){

    try{

        const response =
            await fetch(endpoint);

        const texto =
            await response.text();

        if(!response.ok){

            document.getElementById(
                "alquileresPanel"
            ).innerHTML = `

                <div class="card">

                    <div class="message-error">

                        ❌ ${texto}

                    </div>

                </div>

            `;

            mostrarJSON({
                status: response.status,
                response: texto
            });

            return;
        }

        const alquileres =
            JSON.parse(texto);

        generarCardsAlquileres(
            alquileres,
            titulo
        );

        mostrarJSON(alquileres);

    }
    catch(error){

        mostrarJSON({
            error:error.message
        });

    }

}

/* ==========================================
   CONSULTAR TODOS LOS ALQUILERES
========================================== */
async function consultarTodosAlquileres(){

    await consultarAlquileresEndpoint(
        "/api/alquileres",
        "Todos los Alquileres"
    );

}

/* ==========================================
   CONSULTAR ALQUILERES ACTIVOS
========================================== */
async function consultarAlquileresActivos(){

    await consultarAlquileresEndpoint(
        "/api/alquileres/activos",
        "Alquileres Activos"
    );

}

/* ==========================================
   CONSULTAR ALQUILERES FINALIZADOS
========================================== */
async function consultarAlquileresFinalizados(){

    await consultarAlquileresEndpoint(
        "/api/alquileres/finalizados",
        "Alquileres Finalizados"
    );

}

/* ===================================
    MODO DE PRESENTACION PARA ALQUILERES (CARTAS)
=================================== */
function generarCardsAlquileres(
        alquileres,
        titulo){

    let cards = "";

    alquileres.forEach(alquiler => {

        const saldo =
            alquiler.valorTotal -
            alquiler.valorPagado;

        let estadoClass =
            "alquiler-estado-activo";

        if(alquiler.estado === "FINALIZADO"){

            estadoClass =
                "alquiler-estado-finalizado";
        }

        cards += `

            <div class="alquiler-resumen-card">

                <div class="alquiler-resumen-header">

                    <div class="alquiler-resumen-icon">

                        📄

                    </div>

                    <div class="alquiler-resumen-title">

                        Alquiler #${alquiler.id}

                    </div>

                    <div class="alquiler-resumen-estado ${estadoClass}">

                        ${alquiler.estado}

                    </div>

                </div>

                <div class="alquiler-resumen-body">

                    <div>

                        <strong>Cliente:</strong>

                        ${alquiler.clienteId}

                    </div>

                    <div>

                        <strong>Auto:</strong>

                        ${alquiler.autoId}

                    </div>

                    <div>

                        <strong>Días Contratados:</strong>

                        ${alquiler.cantidadDias}

                    </div>

                    <div>

                        <strong>Días Utilizados:</strong>

                        ${
                            alquiler.diasUtilizados
                                ?? alquiler.cantidadDias
                        }

                    </div>

                    <div>

                        <strong>Total:</strong>

                        $${alquiler.valorTotal}

                    </div>

                    <div>

                        <strong>Pagado:</strong>

                        $${alquiler.valorPagado}

                    </div>

                    <div>

                        <strong>Saldo:</strong>

                        $${saldo}

                    </div>

                </div>

            </div>

        `;

    });

    document.getElementById(
        "alquileresPanel"
    ).innerHTML = `

        <div class="card">

            <h3>
                ${titulo}
            </h3>

            <div class="alquiler-resumen-grid">

                ${cards}

            </div>

        </div>

    `;

}

/* ===================================
   OPCIONES DE GESTION DEL TALLER
=================================== */
function mostrarTaller(){

    activarMenu("Taller");

    workspace.innerHTML = `

        <div class="module-header">

            <h2>
                Taller y Mantenimiento
            </h2>

            <p>
                Administración de kilometraje,
                mantenimientos y habilitación
                de vehículos.
            </p>

        </div>

        <div class="taller-kpi-grid">

            <div class="taller-kpi">

                <div class="taller-kpi-icon">
                    🔧
                </div>

                <div>

                    <span>
                        Vehículos en Taller
                    </span>

                    <h3 id="totalAutosTaller">
                        ...
                    </h3>

                </div>

            </div>

            <div class="taller-kpi">

                <div class="taller-kpi-icon">
                    📏
                </div>

                <div>

                    <span>
                        Control de Kilometraje
                    </span>

                    <h3>
                        Activo
                    </h3>

                </div>

            </div>

        </div>

        <div class="module-grid">

            <button
                class="action-btn"
                onclick="formRegistrarKilometraje()">

                <span class="action-icon">
                    📏
                </span>

                <strong>
                    Registrar Kilometraje
                </strong>

                <small>
                    Actualizar kilómetros recorridos
                </small>

            </button>

            <button
                class="action-btn"
                onclick="formEnviarATaller()">

                <span class="action-icon">
                    🔧
                </span>

                <strong>
                    Enviar a Taller
                </strong>

                <small>
                    Cambiar estado a mantenimiento
                </small>

            </button>

            <button
                class="action-btn"
                onclick="formHabilitarVehiculo()">

                <span class="action-icon">
                    ✅
                </span>

                <strong>
                    Habilitar Vehículo
                </strong>

                <small>
                    Finalizar mantenimiento
                </small>

            </button>

            <button
                class="action-btn"
                onclick="consultarAutosMantenimiento()">

                <span class="action-icon">
                    🚗
                </span>

                <strong>
                    Autos en Mantenimiento
                </strong>

                <small>
                    Consultar vehículos en taller
                </small>

            </button>

        </div>

        <div id="tallerPanel"></div>

    `;

    cargarIndicadoresTaller();

    mostrarJSON({
        modulo:"Taller",
        estado:"Esperando operación"
    });

}

/* ===================================
   CARGAR INDICADORES EN PANTALLA PRINCIPAL
=================================== */
async function cargarIndicadoresTaller(){

    try{

        const response =
            await fetch(
                "/api/autos/mantenimiento"
            );

        const texto =
            await response.text();

        if(!response.ok){

            document.getElementById(
                "totalAutosTaller"
            ).textContent = "0";

            return;
        }

        const autos =
            JSON.parse(texto);

        document.getElementById(
            "totalAutosTaller"
        ).textContent =
            autos.length;

    }
    catch(error){

        document.getElementById(
            "totalAutosTaller"
        ).textContent = "0";

    }

}

/* ===================================
    FORMULARIO PARA INGRESAR KILOMETRAJE
=================================== */
function formRegistrarKilometraje(){

    document.getElementById(
        "tallerPanel"
    ).innerHTML = `

        <section class="card operation-panel">

            <h3>
                📏 Registrar Kilometraje
            </h3>

            <p class="form-description">
                Registra los kilómetros recorridos por el vehículo.
            </p>

            <div class="form-grid">

                <div class="form-field">

                    <label for="autoKilometrajeId">

                        ID Auto <span>*</span>

                    </label>

                    <input
                        id="autoKilometrajeId"
                        type="number"
                        min="1"
                        placeholder="Ej: 1">

                </div>

                <div class="form-field">

                    <label for="kilometros">

                        Kilómetros <span>*</span>

                    </label>

                    <input
                        id="kilometros"
                        type="number"
                        min="1"
                        placeholder="Ej: 500">

                </div>

            </div>

            <div id="kilometrajeMessage"></div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn-primary"
                    onclick="registrarKilometraje()">

                    📏 Guardar Kilometraje

                </button>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarTaller()">

                    Regresar

                </button>

            </div>

        </section>

    `;

}

/* ===================================
    FUNCION PARA REGISTRAR KILOMETRAJE
=================================== */
async function registrarKilometraje(){

    const autoId =
        document.getElementById(
            "autoKilometrajeId"
        ).value;

    const kilometros =
        document.getElementById(
            "kilometros"
        ).value;

    if(!autoId){

        mostrarMensaje(
            "kilometrajeMessage",
            "error",
            "Debe ingresar el ID del auto"
        );

        return;
    }

    if(!kilometros){

        mostrarMensaje(
            "kilometrajeMessage",
            "error",
            "Debe ingresar el kilometraje"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/autos/" +
                autoId +
                "/kilometraje",
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            kilometros:
                                Number(kilometros)
                        })
                }
            );

        const texto =
            await response.text();

        mostrarJSON({
            status: response.status,
            response: texto
        });

        if(response.ok){

            mostrarMensaje(
                "kilometrajeMessage",
                "success",
                texto
            );

        }else{

            mostrarMensaje(
                "kilometrajeMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarMensaje(
            "kilometrajeMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
    FORMULARIO PARA ENVIAR AUTO A TALLER
========================================== */
function formEnviarATaller(){

    document.getElementById(
        "tallerPanel"
    ).innerHTML = `

        <section class="card operation-panel">

            <h3>
                🔧 Enviar Vehículo a Taller
            </h3>

            <p class="form-description">

                Cambia el estado del vehículo a mantenimiento
                para realizar revisión o reparación.

            </p>

            <div class="form-grid">

                <div class="form-field">

                    <label for="autoTallerId">

                        ID Auto <span>*</span>

                    </label>

                    <input
                        id="autoTallerId"
                        type="number"
                        min="1"
                        placeholder="Ej: 1">

                </div>

            </div>

            <div id="tallerMessage"></div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn-primary"
                    onclick="enviarATaller()">

                    🔧 Enviar a Taller

                </button>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarTaller()">

                    Regresar

                </button>

            </div>

        </section>

    `;

}

/* ===================================
    FUNCION PARA ENVIAR AUTO A TALLER
=================================== */
async function enviarATaller(){

    const autoId =
        document.getElementById(
            "autoTallerId"
        ).value;

    if(!autoId){

        mostrarMensaje(
            "tallerMessage",
            "error",
            "Debe ingresar el ID del auto"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/autos/" +
                autoId +
                "/mantenimiento",
                {
                    method:"PUT"
                }
            );

        const texto =
            await response.text();

        mostrarJSON({
            status: response.status,
            response: texto
        });

        if(response.ok){

            mostrarMensaje(
                "tallerMessage",
                "success",
                texto
            );

        }else{

            mostrarMensaje(
                "tallerMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarMensaje(
            "tallerMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
    FORMULARIO PARA HABILITAR AUTO 
========================================== */
function formHabilitarVehiculo(){

    document.getElementById(
        "tallerPanel"
    ).innerHTML = `

        <section class="card operation-panel">

            <h3>
                ✅ Habilitar Vehículo
            </h3>

            <p class="form-description">

                Permite sacar un vehículo del taller,
                reiniciar su kilometraje y dejarlo
                nuevamente disponible para alquiler.

            </p>

            <div class="form-grid">

                <div class="form-field">

                    <label for="autoHabilitarId">

                        ID Auto <span>*</span>

                    </label>

                    <input
                        id="autoHabilitarId"
                        type="number"
                        min="1"
                        placeholder="Ej: 1">

                </div>

            </div>

            <div id="habilitarMessage"></div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn-primary"
                    onclick="habilitarVehiculo()">

                    ✅ Habilitar Vehículo

                </button>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarTaller()">

                    Regresar

                </button>

            </div>

        </section>

    `;

}

/* ===================================
    FUNCION PARA HABILITAR AUTO A DISPONIBLE
=================================== */
async function habilitarVehiculo(){

    const autoId =
        document.getElementById(
            "autoHabilitarId"
        ).value;

    if(!autoId){

        mostrarMensaje(
            "habilitarMessage",
            "error",
            "Debe ingresar el ID del auto"
        );

        return;
    }

    try{

        const response =
            await fetch(
                "/api/autos/" +
                autoId +
                "/habilitar",
                {
                    method:"PUT"
                }
            );

        const texto =
            await response.text();

        mostrarJSON({
            status: response.status,
            response: texto
        });

        if(response.ok){

            mostrarMensaje(
                "habilitarMessage",
                "success",
                texto
            );

        }else{

            mostrarMensaje(
                "habilitarMessage",
                "error",
                texto
            );

        }

    }
    catch(error){

        mostrarMensaje(
            "habilitarMessage",
            "error",
            error.message
        );

    }

}

/* ==========================================
   CONSULTAR AUTOS EN MANTENIMIENTO
========================================== */
async function consultarAutosMantenimiento(){

    await consultarAutosEndpoint(
        "/api/autos/mantenimiento",
        "Autos en Mantenimiento",
        "tallerPanel"
    );

}

/* ===================================
   ARRANQUE
=================================== */
mostrarInicio();
// Fecha de la barra superior (sin dependencias externas).
const fechaActual = document.getElementById('fechaActual');
if (fechaActual) {
    fechaActual.textContent = new Intl.DateTimeFormat('es-CO', {day:'numeric', month:'long', year:'numeric'}).format(new Date());
}
