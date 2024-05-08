const axios = require("axios");

const authenticateJWT = (options = {}) => async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token && !options.optional) {
        return res.status(401).json({ message: "Unauthorized - Missing token" });
    }

    try {
        const response = await axios.get("http://localhost:3000/api/info", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const result = response.data;
            const result_user = result.data.user;

            // If requiredRole is specified, check if user's role matches
            if (options.requiredRole && result_user.role !== options.requiredRole) {
                return res.status(403).json({ message: "Forbidden - Insufficient privileges" });
            }

            req.user = result_user;
            return next();
        } else {
            return res.status(403).json({ message: "Forbidden - Invalid token" });
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authenticateJWT;