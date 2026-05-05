const express = require('express');
const router = express.Router();
const db = require('../models/database');

// ===== TURNOS =====

// Obtener todos los turnos (para admin)
router.get('/admin/turnos', (req, res) => {
    db.all(`
        SELECT t.*, u.nombre as nombre_usuario, u.email as email_usuario
        FROM turnos t
        JOIN usuarios u ON t.usuario_id = u.id
        ORDER BY t.fecha DESC
    `, (err, turnos) => {
        if (err) {
            return res.json({ exito: false, turnos: [] });
        }
        res.json({ exito: true, turnos: turnos || [] });
    });
});

// Cambiar estado de un turno
router.put('/admin/turnos/:turnoId', (req, res) => {
    const turnoId = req.params.turnoId;
    const nuevoEstado = req.body.estado;
    
    db.run(
        'UPDATE turnos SET estado = ? WHERE id = ?',
        [nuevoEstado, turnoId],
        function(err) {
            if (err) {
                return res.json({ exito: false, mensaje: 'Error al actualizar turno' });
            }
            res.json({ exito: true, mensaje: 'Turno actualizado' });
        }
    );
});

// ===== FOTOS =====

// Crear foto
router.post('/admin/fotos', (req, res) => {
    const { nombre, url } = req.body;
    
    if (!nombre || !url) {
        return res.json({ exito: false, mensaje: 'Faltan datos' });
    }
    
    db.run(
        'INSERT INTO fotos (nombre, url) VALUES (?, ?)',
        [nombre, url],
        function(err) {
            if (err) {
                return res.json({ exito: false, mensaje: 'Error al subir foto' });
            }
            res.json({ exito: true, mensaje: 'Foto subida correctamente' });
        }
    );
});

// Eliminar foto
router.delete('/admin/fotos/:fotoId', (req, res) => {
    const fotoId = req.params.fotoId;
    
    db.run(
        'DELETE FROM fotos WHERE id = ?',
        [fotoId],
        function(err) {
            if (err) {
                return res.json({ exito: false, mensaje: 'Error al eliminar foto' });
            }
            res.json({ exito: true, mensaje: 'Foto eliminada' });
        }
    );
});

// ===== CONFIGURACIÓN =====

// Obtener configuración
router.get('/admin/configuracion', (req, res) => {
    db.get(
        'SELECT * FROM configuracion LIMIT 1',
        (err, config) => {
            if (err) {
                return res.json({ exito: false, configuracion: null });
            }
            res.json({ exito: true, configuracion: config });
        }
    );
});

// Guardar configuración
router.post('/admin/configuracion', (req, res) => {
    const { foto_portada, horarios_abierto, horarios_cierre, descripcion } = req.body;
    
    // Primero verificar si existe configuración
    db.get('SELECT id FROM configuracion LIMIT 1', (err, row) => {
        if (row) {
            // Actualizar
            db.run(
                'UPDATE configuracion SET foto_portada = ?, horarios_abierto = ?, horarios_cierre = ?, descripcion = ?',
                [foto_portada, horarios_abierto, horarios_cierre, descripcion],
                function(err) {
                    if (err) {
                        return res.json({ exito: false, mensaje: 'Error al guardar' });
                    }
                    res.json({ exito: true, mensaje: 'Configuración guardada' });
                }
            );
        } else {
            // Insertar
            db.run(
                'INSERT INTO configuracion (foto_portada, horarios_abierto, horarios_cierre, descripcion) VALUES (?, ?, ?, ?)',
                [foto_portada, horarios_abierto, horarios_cierre, descripcion],
                function(err) {
                    if (err) {
                        return res.json({ exito: false, mensaje: 'Error al guardar' });
                    }
                    res.json({ exito: true, mensaje: 'Configuración guardada' });
                }
            );
        }
    });
});

module.exports = router;