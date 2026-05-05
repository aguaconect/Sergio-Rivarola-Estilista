// Cambiar entre formulario de login y registro
function cambiarFormulario() {
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');
    
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registroForm.style.display = registroForm.style.display === 'none' ? 'block' : 'none';
}

// Función para hacer el Registro
function hacerRegistro(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre-registro').value;
    const email = document.getElementById('email-registro').value;
    const telefono = document.getElementById('telefono-registro').value;
    const password = document.getElementById('password-registro').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    const mensaje = document.getElementById('mensaje-registro');
    
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        mostrarMensaje(mensaje, 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
        mostrarMensaje(mensaje, 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Enviar datos al servidor
    fetch('/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre,
            email,
            telefono,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            mostrarMensaje(mensaje, 'Registro exitoso. Inicia sesión ahora', 'exito');
            setTimeout(() => {
                cambiarFormulario();
                document.getElementById('registro-form').reset();
            }, 2000);
        } else {
            mostrarMensaje(mensaje, data.mensaje || 'Error en el registro', 'error');
        }
    })
    .catch(err => {
        mostrarMensaje(mensaje, 'Error al conectar con el servidor', 'error');
    });
}

// Función para hacer el Login
function hacerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;
    const mensaje = document.getElementById('mensaje-login');
    
    // Enviar datos al servidor
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.exito) {
            mostrarMensaje(mensaje, 'Login exitoso. Redirigiendo...', 'exito');
            // Guardar el usuario en localStorage
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Si es admin, ir al panel admin, si no, ir a solicitar turno
            setTimeout(() => {
                if (data.usuario.es_admin) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/turnos';
                }
            }, 1500);
        } else {
            mostrarMensaje(mensaje, data.mensaje || 'Email o contraseña incorrectos', 'error');
        }
    })
    .catch(err => {
        mostrarMensaje(mensaje, 'Error al conectar con el servidor', 'error');
    });
}

// Función auxiliar para mostrar mensajes
function mostrarMensaje(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = 'mensaje ' + tipo;
}

// Verificar si el usuario ya está logeado
window.addEventListener('load', () => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
        // Si ya está logeado, redirigir según su rol
        const usuarioObj = JSON.parse(usuario);
        if (usuarioObj.es_admin) {
            window.location.href = '/admin';
        } else {
            window.location.href = '/turnos';
        }
    }
});