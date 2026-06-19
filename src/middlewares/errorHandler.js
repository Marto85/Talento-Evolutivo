const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  // Errores de validación de Mongoose
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    if (req.accepts("json") && !req.accepts("html")) {
      return res.status(400).json({ errores });
    }
    return res.status(400).render("404", { mensaje: errores.join(", ") });
  }

  // Errores de Cast (ID inválido)
  if (err.name === "CastError") {
    if (req.accepts("json") && !req.accepts("html")) {
      return res.status(400).json({ error: "ID inválido" });
    }
    return res.status(400).render("404", { mensaje: "ID inválido" });
  }

  // Errores de duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const errores = [`El campo '${field}' ya existe en la base de datos`];
    if (req.accepts("json") && !req.accepts("html")) {
      return res.status(400).json({ errores });
    }
    return res.status(400).render("404", { mensaje: errores[0] });
  }

  // Errores genéricos
  if (req.accepts("json") && !req.accepts("html")) {
    return res.status(statusCode).json({ error: message });
  }

  res.status(statusCode).render("404", { mensaje: message });
};

module.exports = errorHandler;
