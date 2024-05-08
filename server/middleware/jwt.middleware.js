const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt.config");

const authenticateJWT = (options = {}) => (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        if (options.optional) {
            return next(); // No token provided, but authentication is optional
        } else {
            return res.status(401).json({ message: "Unauthorized - Missing token" });
        }
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }

    const token = parts[1];

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden - Invalid token" });
        }

        // Check if the user has the required role if specified
        if (options.requiredRole && user.role !== options.requiredRole) {
            return res.status(403).json({ message: "Forbidden - Insufficient privileges" });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;