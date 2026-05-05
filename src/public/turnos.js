// Cargar información del usuario al abrir la página
window.addEventListener('load', () => {
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
        // Si no está logeado, redirigir al login
        window.location.href = '/login';
        return;
    }
    
    const usuarioObj = JSON.parse(usuario);
    document.getElementById('nombre-usuario').textContent = usuarioObj.nombre;
    document.getElementById('email-usuario').textContent = usuarioObj.email;
    
    // Cargar mis turnos
    cargarMisTurnos(usuarioObj.id);
});

// Función para solicitar un turno
function solicitarTurno(event) {
    event.preventDefault();
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const servicio = document.getElementById('servicio').value;
    const mensaje = document.getElementById('mensaje-turno');
    
    // Validar que la fecha sea futura
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
        mostrarMensaje(mensaje, 'Selecciona una fecha futura', 'error');
        return;
    }
    
    // Enviar turno al servidor
    fetch('/api/turnos/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usuario_id: usuario.id,
            fecha,
            hora,
            servicio
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            mostrarMensaje(mensaje, 'Turno solicitado correctamente', 'exito');
            document.querySelector('.form-turno').reset();
            // Recargar los turnos
            setTimeout(() => {
                cargarMisTurnos(usuario.id);
            }, 1000);
        } else {
            mostrarMensaje(mensaje, data.mensaje || 'Error al solicitar turno', 'error');
        }
    })
    .catch(err => {
        mostrarMensaje(mensaje, 'Error al conectar con el servidor', 'error');
    });
}

// Función para cargar los turnos del usuario
function cargarMisTurnos(usuarioId) {
    fetch(`/api/turnos/${usuarioId}`)
        .then(res => res.json())
        .then(data => {
            const listaTurnos = document.getElementById('lista-turnos');
            
            if (data.turnos.length === 0) {
                listaTurnos.innerHTML = '<p>No tienes turnos solicitados</p>';
                return;
            }
            
            let html = '';
            data.turnos.forEach(turno => {
                html += `
                    <div class="turno-item">
                        <p><strong>Servicio:</strong> ${turno.servicio}</p>
                        <p><strong>Fecha:</strong> ${formatearFecha(turno.fecha)}</p>
                        <p><strong>Hora:</strong> ${turno.hora}</p>
                        <span class="turno-estado ${turno.estado}">${turno.estado.toUpperCase()}</span>
                    </div>
                `;
            });
            
            listaTurnos.innerHTML = html;
        })
        .catch(err => {
            console.error('Error al cargar turnos:', err);
        });
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = 'mensaje ' + tipo;
    elemento.style.display = 'block';
}

// Función para formatear fechas
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = '/';
}

// Establecer fecha mínima en el input de fecha
document.addEventListener('DOMContentLoaded', () => {
    const inputFecha = document.getElementById('fecha');
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.min = hoy;
});