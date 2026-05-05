const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Conectado a la base de datos');
    
    // Crear usuario admin
    const passwordEncriptada = bcrypt.hashSync('sergio123', 10);

    db.run(
      'INSERT OR IGNORE INTO usuarios (nombre, email, telefono, password, es_admin) VALUES (?, ?, ?, ?, ?)',
      ['Sergio Rivarola', 'sergio@admin.com', '1234567890', passwordEncriptada, 1],
      function(err) {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('✅ Usuario admin creado correctamente');
          console.log('📧 Email: sergio@admin.com');
          console.log('🔑 Contraseña: sergio123');
        }
        db.close();
      }
    );
  }
});