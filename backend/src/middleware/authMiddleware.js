const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Obtener el token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. No se proporcionó un token.'
        });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        // Agregar los datos del usuario decodificados al objeto req
        req.user = decoded;
        
        next(); // Continuar a la siguiente función
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
                expired: true
            });
        }

        res.status(403).json({
            success: false,
            message: 'Token no válido'
        });
    }
};

module.exports = authMiddleware;
