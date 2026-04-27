"use strict";

// 1. ¡VITAL! Esta línea carga la contraseña y datos del archivo .env
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const app = express();

// 2. CORRECCIÓN DE RUTA: 
// Como este index.js ya está en /src, la ruta empieza desde su posición actual.
const solicitudesRoutes = require('./src/routes/solicitudes.routes');

app.use(cors()); 
app.use(express.json()); 

app.use('/api/solicitudes', solicitudesRoutes);

app.get('/test', (req, res) => {
    res.json({ mensaje: "Backend del SGP funcionando correctamente" });
});

// 3. USAR EL PUERTO DEL .env o el 3001 por defecto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor SGP listo en http://localhost:${PORT}`);
});