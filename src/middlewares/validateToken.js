const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/passport");

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Token vacío" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirado" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Token inválido" });
      }
      return res.status(401).json({ error: "Error al validar token" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { validateToken };
