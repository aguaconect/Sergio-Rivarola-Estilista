let turnosFiltroActual = 'todos';

// Cargar datos al abrir la página
window.addEventListener('load', () => {
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
        window.location.href = '/login';
        return;
    }
    
    const usuarioObj = JSON.parse(usuario);
    
    // Verificar que sea admin
    if (!usuarioObj.es_admin) {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '/';
        return;
    }
    
    // Cargar datos
    cargarTurnos();
    cargarFotos();
    cargarConfiguracion();
});

// Cambiar entre tabs
function cambiarTab(tabNombre) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('activo');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('activo');
    });
    
    // Mostrar el tab seleccionado
    document.getElementById('tab-' + tabNombre).classList.add('activo');
    event.target.classList.add('activo');
}

// ===== GESTIÓN DE TURNOS =====

function cargarTurnos() {
    fetch('/api/admin/turnos')
        .then(res => res.json())
        .then(data => {
            if (data.exito) {
                mostrarTurnos(data.turnos);
            }
        })
        .catch(err => console.error('Error al cargar turnos:', err));
}

function mostrarTurnos(turnos) {
    const lista = document.getElementById('lista-turnos-admin');
    
    // Filtrar turnos según el filtro activo
    let turnosFiltrados = turnos;
    if (turnosFiltroActual !== 'todos') {
        turnosFiltrados = turnos.filter(t => t.estado === turnosFiltroActual);
    }
    
    if (turnosFiltrados.length === 0) {
        lista.innerHTML = '<p>No hay turnos en esta categoría</p>';
        return;
    }
    
    let html = '';
    turnosFiltrados.forEach(turno => {
        html += `
            <div class="turno-admin-item">
                <h4>${turno.servicio}</h4>
                <div class="turno-admin-info">
                    <p><strong>Usuario:</strong> ${turno.nombre_usuario}</p>
                    <p><strong>Email:</strong> ${turno.email_usuario}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(turno.fecha)}</p>
                    <p><strong>Hora:</strong> ${turno.hora}</p>
                    <p><strong>Estado:</strong> <span class="turno-estado ${turno.estado}">${turno.estado.toUpperCase()}</span></p>
                </div>
                <div class="turno-acciones">
                    ${turno.estado === 'pendiente' ? `
                        <button class="btn-aprobar" onclick="cambiarEstadoTurno(${turno.id}, 'aprobado')">Aprobar</button>
                        <button class="btn-rechazar" onclick="cambiarEstadoTurno(${turno.id}, 'rechazado')">Rechazar</button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    lista.innerHTML = html;
}

function filtrarTurnos(filtro) {
    turnosFiltroActual = filtro;
    cargarTurnos();
}

function cambiarEstadoTurno(turnoId, nuevoEstado) {
    fetch('/api/admin/turnos/' + turnoId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: nuevoEstado
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            alert('Turno ' + nuevoEstado);
            cargarTurnos();
        }
    })
    .catch(err => console.error('Error:', err));
}

// ===== GESTIÓN DE FOTOS =====

function subirFoto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre-foto').value;
    const url = document.getElementById('url-foto').value;
    const mensaje = document.getElementById('mensaje-foto');
    
    fetch('/api/admin/fotos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            url
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            mostrarMensaje(mensaje, 'Foto subida correctamente', 'exito');
            document.getElementById('form-fotos').reset();
            setTimeout(() => {
                cargarFotos();
            }, 1000);
        } else {
            mostrarMensaje(mensaje, data.mensaje || 'Error al subir foto', 'error');
        }
    })
    .catch(err => {
        mostrarMensaje(mensaje, 'Error al conectar', 'error');
    });
}

function cargarFotos() {
    fetch('/api/fotos')
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('lista-fotos');
            
            if (data.fotos.length === 0) {
                lista.innerHTML = '<p>No hay fotos en la galería</p>';
                return;
            }
            
            let html = '';
            data.fotos.forEach(foto => {
                html += `
                    <div class="foto-admin-item">
                        <img src="${foto.url}" alt="${foto.nombre}">
                        <button class="foto-admin-eliminar" onclick="eliminarFoto(${foto.id})">Eliminar</button>
                    </div>
                `;
            });
            
            lista.innerHTML = html;
        })
        .catch(err => console.error('Error:', err));
}

function eliminarFoto(fotoId) {
    if (!confirm('¿Seguro que quieres eliminar esta foto?')) return;
    
    fetch('/api/admin/fotos/' + fotoId, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            alert('Foto eliminada');
            cargarFotos();
        }
    })
    .catch(err => console.error('Error:', err));
}

// ===== GESTIÓN DE CONFIGURACIÓN =====

function cargarConfiguracion() {
    fetch('/api/admin/configuracion')
        .then(res => res.json())
        .then(data => {
            if (data.exito && data.configuracion) {
                const config = data.configuracion;
                document.getElementById('foto-portada-url').value = config.foto_portada || '';
                document.getElementById('horario-abierto').value = config.horarios_abierto || '';
                document.getElementById('horario-cierre').value = config.horarios_cierre || '';
                document.getElementById('descripcion').value = config.descripcion || '';
            }
        })
        .catch(err => console.error('Error:', err));
}

function guardarConfiguracion(event) {
    event.preventDefault();
    
    const fotoportada = document.getElementById('foto-portada-url').value;
    const horarioAbierto = document.getElementById('horario-abierto').value;
    const horarioCierre = document.getElementById('horario-cierre').value;
    const descripcion = document.getElementById('descripcion').value;
    const mensaje = document.getElementById('mensaje-config');
    
    fetch('/api/admin/configuracion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            foto_portada: fotoportada,
            horarios_abierto: horarioAbierto,
            horarios_cierre: horarioCierre,
            descripcion
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            mostrarMensaje(mensaje, 'Configuración guardada correctamente', 'exito');
        } else {
            mostrarMensaje(mensaje, 'Error al guardar configuración', 'error');
        }
    })
    .catch(err => {
        mostrarMensaje(mensaje, 'Error al conectar', 'error');
    });
}

// ===== FUNCIONES AUXILIARES =====

function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = 'mensaje ' + tipo;
}

function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}