const express = require('express');
const path = require('path');
const db = require('./src/models/database');
const authRoutes = require('./src/routes/auth');
const turnosRoutes = require('./src/routes/turnos');
const app = express();
const PORT = 3000;

// Configuración
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Usar las rutas
app.use('/api', authRoutes);
app.use('/api', turnosRoutes);

// Rutas básicas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/login.html'));
});

app.get('/turnos', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/turnos.html'));
});

app.get('/galeria', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/galeria.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/admin.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});