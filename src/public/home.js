// Cargar configuración del sitio
window.addEventListener('load', () => {
    cargarConfiguracionInicio();
});

function cargarConfiguracionInicio() {
    fetch('/api/admin/configuracion')
        .then(res => res.json())
        .then(data => {
            if (data.exito && data.configuracion) {
                const config = data.configuracion;
                
                // Actualizar foto de portada si existe
                if (config.foto_portada) {
                    const hero = document.getElementById('hero');
                    hero.style.backgroundImage = `url('${config.foto_portada}')`;
                    hero.style.backgroundSize = 'cover';
                    hero.style.backgroundPosition = 'center';
                }
            }
        })
        .catch(err => console.error('Error al cargar configuración:', err));
}