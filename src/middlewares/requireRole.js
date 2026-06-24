const requireRole = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const user = req.user || req.authUser || req.session?.passport?.user;

      if (!user || !user.role) {
        if (req.accepts("json") && !req.accepts("html")) {
          return res.status(403).json({ error: "No autorizado" });
        }

        return res.status(403).render("404", { mensaje: "No autorizado" });
      }

      if (!rolesPermitidos.includes(user.role)) {
        if (req.accepts("json") && !req.accepts("html")) {
          return res.status(403).json({ error: "No autorizado" });
        }

        return res.status(403).render("404", { mensaje: "No autorizado" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { requireRole };