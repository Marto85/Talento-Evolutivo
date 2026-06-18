const crypto = require("crypto");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const readCsrfToken = (req) => {
  return req.body?._csrf || req.headers["x-csrf-token"] || req.headers["csrf-token"];
};

const csrfProtection = (req, res, next) => {
  if (!req.session) return next(new Error("La sesion no esta disponible para CSRF"));

  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.has(req.method)) return next();

  const submittedToken = readCsrfToken(req);
  const sessionToken = req.session.csrfToken;

  if (!submittedToken || submittedToken !== sessionToken) {
    if (req.accepts("json") && !req.accepts("html")) {
      return res.status(403).json({ error: "Token CSRF invalido" });
    }

    return res.status(403).render("404", { mensaje: "Solicitud rechazada por seguridad CSRF" });
  }

  return next();
};

module.exports = { csrfProtection };
