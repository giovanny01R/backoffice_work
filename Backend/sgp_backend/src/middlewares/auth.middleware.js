"use strict";
const jwt = require("jsonwebtoken");

/**
 * Filtro 1: Autenticación (¿Quién eres?)
 * Revisa que el usuario haya iniciado sesión correctamente.
 */
function autenticar(req, res, next) {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso denegado. Se requiere un token del SGP." });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Usa el secreto específico de TU proyecto SGP
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Sesión expirada o token no válido para el SGP." });
    }
}

/**
 * Filtro 2: Autorización (¿Qué puedes hacer?)
 * Revisa si tu rol tiene permiso para entrar a esta parte del SGP.
 */
function autorizar(...rolesPermitidos) {
    return (req, res, next) => {
        // Verificamos si el rol del usuario está en la lista de permitidos
        if (!rolesPermitidos.includes(req.usuario?.rol)) {
            return res.status(403).json({ error: "No tienes los privilegios necesarios para esta acción." });
        }
        next();
    };
}

module.exports = { autenticar, autorizar };