"use strict";

const express = require("express");
const router = express.Router();
// Importamos la lógica que acabamos de escribir en el controlador
const { crearSolicitud } = require("../controllers/solicitudes.controller");
// Importamos el middleware para asegurar que solo usuarios logueados entren
const { autenticar } = require("../middlewares/auth.middleware");

/**
 * RUTA: POST /api/solicitudes
 * DESCRIPCIÓN: Recibe los datos del formulario de Angular y los guarda.
 * PROTECCIÓN: Requiere Token JWT válido.
 */
router.post("/", autenticar, crearSolicitud);

module.exports = router;