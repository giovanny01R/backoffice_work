const pool = require('../config/db');

const crearSolicitud = async (req, res) => {
    const d = req.body;
    try {
        const query = `
            INSERT INTO visitas.solicitudes 
            (tipo_solicitud, documento, nombre, fecha_nac, fecha_expedicion, direccion, telefono, correo, zona, rol, grupo_venta, liquidacion, ceco, codigo_sf, plan_virtual) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
            RETURNING *`;
        const values = [d.tipo_solicitud, d.documento, d.nombre, d.fechaNac, d.fechaExpedicion, d.direccion, d.telefono, d.correo, d.zona, d.rol, d.grupoVenta, d.liquidacion, d.ceco, d.codigoSF, d.planVirtual];
        
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la solicitud" });
    }
};

const obtenerPendientes = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM visitas.solicitudes WHERE estado_solicitud = 'PENDIENTE'");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener pendientes" });
    }
};

const aprobarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE visitas.solicitudes SET estado_solicitud = 'APROBADO' WHERE id_solicitud = $1", [id]);
        res.json({ message: "Solicitud aprobada" });
    } catch (err) {
        res.status(500).json({ error: "Error al aprobar" });
    }
};

const obtenerHistorial = async (req, res) => {
    const { documento } = req.params;
    try {
        const query = "SELECT * FROM visitas.solicitudes WHERE documento = $1 AND estado_solicitud = 'APROBADO'";
        const result = await pool.query(query, [documento]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al buscar historial" });
    }
};

// 5. Guardar el contrato final (Módulo 3 - Cierre) CORREGIDO
const guardarContrato = async (req, res) => {
    const d = req.body;
    try {
        // Insertamos en contratos la info completa (33 parámetros)
        const queryContrato = `
            INSERT INTO visitas.contratos (
                id_solicitud_ref, numero_solicitud, tipo_solicitud, fecha_solicitud,
                documento, nombre, fecha_nac, fecha_expedicion, direccion, 
                telefono, correo, zona, rol, grupo_venta, liquidacion, 
                ceco, codigo_sf, plan_virtual,
                cerberus, contrato_codesa, manager, sinet, jaspersoft, 
                sims, cem, onj, visiapp, papeleria, superflex,
                incidente_manager, incidente_sinet, incidente_jaspersoft, incidente_sims
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
                $29, $30, $31, $32, $33
            )`;
            
        const values = [
            d.id_solicitud, d.numero_solicitud, d.tipo_solicitud, d.fecha, 
            d.documento, d.nombre, d.fechaNac, d.fechaExpedicion, d.direccion,
            d.telefono, d.correo, d.zona, d.rol, d.grupoVenta, d.liquidacion,
            d.ceco, d.codigoSF, d.planVirtual,
            d.cerberus, d.contratocodesa, d.manager, d.sinet, d.jaspersoft,
            d.sims, d.cem, d.onj, d.visiapp, d.papeleria, d.superflex,
            d.incidenteManager, d.incidenteSinet, d.incidenteJaspersoft, d.incidenteSims
        ];
        
        await pool.query(queryContrato, values);

        // Actualizamos la solicitud a FINALIZADO para sacarla del circuito
        await pool.query("UPDATE visitas.solicitudes SET estado_solicitud = 'FINALIZADO' WHERE id_solicitud = $1", [d.id_solicitud]);

        res.status(201).json({ message: "Contrato maestro creado exitosamente" });
    } catch (err) {
        console.error("Error BD:", err);
        res.status(500).json({ error: "Error al guardar el contrato final" });
    }
};

module.exports = { crearSolicitud, obtenerPendientes, aprobarSolicitud, obtenerHistorial, guardarContrato };