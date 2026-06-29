const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { passport, ensureDefaultUser, JWT_SECRET, JWT_EXPIRES_IN } = require("../config/passport");
const { hashPassword } = require("../utils/password");
const { notificarAdmins } = require("../utils/notificar");

const renderLogin = (res, options = {}) => {
  res.render("auth/login", {
    authPage: true,
    authRequired: false,
    error: null,
    success: null,
    lastUser: "",
    ...options,
  });
};

const mostrarLogin = async (req, res, next) => {
  try {
    await ensureDefaultUser();

    if (req.isAuthenticated && req.isAuthenticated()) return res.redirect("/empresas");

    const success = req.query.registered ? "Registro exitoso. Ya podés ingresar." : null;
    renderLogin(res, { success });
  } catch (error) {
    next(error);
  }
};

const mostrarRegistro = async (req, res, next) => {
  try {
    await ensureDefaultUser();

    if (req.isAuthenticated && req.isAuthenticated()) return res.redirect("/empresas");

    return res.render("auth/register", { authPage: true, authRequired: false, errores: null, lastUser: "" });
  } catch (error) {
    next(error);
  }
};

const registrar = async (req, res, next) => {
  try {
    const user = String(req.body.user || "").trim();
    const password = String(req.body.password || "").trim();
    const confirm = String(req.body.confirm || "").trim();

    const errores = [];
    if (!user) errores.push("Usuario es obligatorio");
    if (!password) errores.push("Password es obligatorio");
    if (password !== confirm) errores.push("Las contraseñas no coinciden");
    if (password && password.length < 4) errores.push("La contraseña debe tener al menos 4 caracteres");

    if (errores.length > 0) {
      return res.status(400).render("auth/register", { authPage: true, authRequired: false, errores, lastUser: user });
    }

    const hashed = await hashPassword(password);
    await Usuario.create({ user, password: hashed, role: "empleado", aprobado: false });

    await notificarAdmins(req.app, `Nuevo usuario pendiente de aprobación: ${user}`, '/admin/users');

    return res.redirect("/pendiente");
  } catch (error) {
    // Dejar que el errorHandler maneje duplicados y demás
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
        const token = authUser.token || '';

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
      localStorage.setItem('authToken', '${token}');
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

const mostrarPendiente = (req, res) => {
  res.render("auth/pendiente", { authPage: true, authRequired: false });
};

module.exports = { mostrarLogin, mostrarRegistro, registrar, login, logout, mostrarPendiente };
