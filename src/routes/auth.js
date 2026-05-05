const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models/database');

// Ruta para Registro
router.post('/registro', (req, res) => {
    const { nombre, email, telefono, password } = req.body;
    
    // Validar que no esté vacío
    if (!nombre || !email || !password) {
        return res.json({ exito: false, mensaje: 'Completa todos los campos obligatorios' });
    }
    
    // Encriptar la contraseña
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    
    // Insertar en la base de datos
    db.run(
        'INSERT INTO usuarios (nombre, email, telefono, password) VALUES (?, ?, ?, ?)',
        [nombre, email, telefono, passwordEncriptada],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.json({ exito: false, mensaje: 'Este email ya está registrado' });
                }
                return res.json({ exito: false, mensaje: 'Error en el registro' });
            }
            
            res.json({ exito: true, mensaje: 'Usuario registrado correctamente' });
        }
    );
});

// Ruta para Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Validar que no esté vacío
    if (!email || !password) {
        return res.json({ exito: false, mensaje: 'Email y contraseña son obligatorios' });
    }
    
    // Buscar el usuario en la base de datos
    db.get(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        (err, usuario) => {
            if (err) {
                return res.json({ exito: false, mensaje: 'Error al buscar usuario' });
            }
            
            // Si no existe el usuario
            if (!usuario) {
                return res.json({ exito: false, mensaje: 'Email o contraseña incorrectos' });
            }
            
            // Comparar la contraseña
            const passwordValida = bcrypt.compareSync(password, usuario.password);
            
            if (!passwordValida) {
                return res.json({ exito: false, mensaje: 'Email o contraseña incorrectos' });
            }
            
            // Login exitoso
            res.json({
                exito: true,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    es_admin: usuario.es_admin
                }
            });
        }
    );
});

module.exports = router;