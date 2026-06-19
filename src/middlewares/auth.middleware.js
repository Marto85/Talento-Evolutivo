const requireAuth = async (req, res, next) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
      if (req.accepts("json") && !req.accepts("html")) {
        return res.status(401).json({ error: "No autenticado" });
      }

      res.clearCookie("connect.sid");
      return res.redirect("/login");
    }

    req.authUser = req.user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireAuth };