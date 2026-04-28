const express = require('express');
const router = express.Router();
const controller = require('../controllers/solicitudes.controller');

// Crear solicitud (Módulo 1)
router.post('/', controller.crearSolicitud);

// Gestión (Módulo 2)
router.get('/pendientes', controller.obtenerPendientes);
router.patch('/:id/aprobar', controller.aprobarSolicitud);

// Contratos finales (Módulo 3)
router.get('/historial/:documento', controller.obtenerHistorial);
router.post('/finalizar', controller.guardarContrato); 

module.exports = router;