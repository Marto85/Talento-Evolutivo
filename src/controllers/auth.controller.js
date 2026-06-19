const Usuario = require("../models/Usuario");
const { passport, ensureDefaultUser } = require("../config/passport");

const renderLogin = (res, options = {}) => {
  res.render("auth/login", {
    authPage: true,
    authRequired: false,
    error: null,
    lastUser: "",
    ...options,
  });
};

const mostrarLogin = async (req, res, next) => {
  try {
    await ensureDefaultUser();

    if (req.isAuthenticated && req.isAuthenticated()) return res.redirect("/empresas");

    renderLogin(res);
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (error, authUser, info) => {
    if (error) return next(error);

    const attemptedUser = String(req.body.user || "").trim();

    if (!authUser) {
      return res.status(401).render("auth/login", {
        authPage: true,
        authRequired: false,
        error: info?.message || "Usuario o password incorrectos",
        lastUser: attemptedUser,
      });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) return next(sessionError);

      req.logIn(authUser, (loginError) => {
        if (loginError) return next(loginError);

        const safeUser = JSON.stringify(authUser.user);

        return res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingresando...</title>
  </head>
  <body>
    <p>Ingresando...</p>
    <script>
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('loggedUser', ${safeUser});
      window.location.replace('/empresas');
    </script>
  </body>
</html>`);
      });
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      await Usuario.findByIdAndUpdate(req.user.id, { token: null });
    }

    req.logout((logoutError) => {
      if (logoutError) return next(logoutError);

      req.session.destroy((sessionError) => {
        if (sessionError) return next(sessionError);

        res.clearCookie("connect.sid");
        return res.status(200).json({ ok: true });
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { mostrarLogin, login, logout };
