"use strict";
const db = require("../config/db");

const crearSolicitud = async (req, res) => {
    try {
        // Extraemos TODO lo que enviaste desde el componente de Angular
        const { 
            tipo_solicitud, fecha, documento, nombre, fechaNac, 
            fechaExpedicion, direccion, telefono, correo, zona, 
            rol, grupoVenta, liquidacion, ceco, codigoSF, planVirtual 
        } = req.body;

        const query = `
            INSERT INTO solicitudes_contrato 
            (tipo_solicitud, fecha_solicitud, documento, nombre_completo, fecha_nacimiento, 
             fecha_expedicion, direccion, telefono, correo, zona, rol, grupo_venta, 
             liquidacion, ceco, codigo_sf, plan_virtual, id_usuario_creador)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *;
        `;

        const values = [
            tipo_solicitud, fecha, documento, nombre, fechaNac, 
            fechaExpedicion, direccion, telefono, correo, zona, 
            rol, grupoVenta, liquidacion, ceco, codigoSF, planVirtual,
            req.usuario.id // El ID del usuario que está logueado (viene del token)
        ];

        const { rows } = await db.query(query, values);

        res.status(201).json({
            mensaje: "¡Solicitud guardada en el SGP!",
            data: rows[0]
        });

    } catch (error) {
        console.error("Error en SGP Controller:", error);
        res.status(500).json({ error: "No se pudo procesar la solicitud en el servidor" });
    }
};

module.exports = { crearSolicitud };