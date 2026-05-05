const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Crear un turno
router.post('/turnos/crear', (req, res) => {
    const { usuario_id, fecha, hora, servicio } = req.body;
    
    if (!usuario_id || !fecha || !hora || !servicio) {
        return res.json({ exito: false, mensaje: 'Faltan datos' });
    }
    
    db.run(
        'INSERT INTO turnos (usuario_id, fecha, hora, servicio, estado) VALUES (?, ?, ?, ?, ?)',
        [usuario_id, fecha, hora, servicio, 'pendiente'],
        function(err) {
            if (err) {
                return res.json({ exito: false, mensaje: 'Error al crear turno' });
            }
            
            res.json({ exito: true, mensaje: 'Turno creado correctamente' });
        }
    );
});

// Obtener turnos de un usuario
router.get('/turnos/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;
    
    db.all(
        'SELECT * FROM turnos WHERE usuario_id = ? ORDER BY fecha DESC',
        [usuarioId],
        (err, turnos) => {
            if (err) {
                return res.json({ exito: false, turnos: [] });
            }
            
            res.json({ exito: true, turnos: turnos || [] });
        }
    );
});

// Obtener todas las fotos
router.get('/fotos', (req, res) => {
    db.all(
        'SELECT * FROM fotos ORDER BY fecha_subida DESC',
        (err, fotos) => {
            if (err) {
                return res.json({ exito: false, fotos: [] });
            }
            
            res.json({ exito: true, fotos: fotos || [] });
        }
    );
});
module.exports = router;