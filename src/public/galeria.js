// Cargar fotos al abrir la página
window.addEventListener('load', () => {
    cargarFotos();
});

// Función para cargar las fotos
function cargarFotos() {
    fetch('/api/fotos')
        .then(res => res.json())
        .then(data => {
            const galeria = document.getElementById('galeria');
            
            if (data.fotos.length === 0) {
                galeria.innerHTML = '<p class="cargando">No hay fotos en la galería aún</p>';
                return;
            }
            
            let html = '';
            data.fotos.forEach(foto => {
                html += `
                    <div class="foto-item" onclick="abrirModal('${foto.url}')">
                        <img src="${foto.url}" alt="Trabajo de ${foto.nombre}">
                    </div>
                `;
            });
            
            galeria.innerHTML = html;
        })
        .catch(err => {
            console.error('Error al cargar fotos:', err);
            document.getElementById('galeria').innerHTML = '<p class="cargando">Error al cargar las fotos</p>';
        });
}

// Función para abrir el modal con la foto grande
function abrirModal(url) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modal.classList.add('activo');
    modalImg.src = url;
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('activo');
}

// Cerrar modal cuando se hace clic afuera de la imagen
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        cerrarModal();
    }
});