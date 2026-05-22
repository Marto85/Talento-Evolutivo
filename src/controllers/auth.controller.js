const Usuario = require("../models/Usuario");

const DEFAULT_AUTH_USER = process.env.AUTH_USER;
const DEFAULT_AUTH_PASSWORD = process.env.AUTH_PASSWORD;

const renderLogin = (res, options = {}) => {
  res.render("auth/login", {
    authPage: true,
    authRequired: false,
    error: null,
    lastUser: "",
    ...options,
  });
};

const ensureDefaultUser = async () => {
  const usuarios = await Usuario.estimatedDocumentCount();
  if (usuarios > 0) return;

  await Usuario.create({
    user: DEFAULT_AUTH_USER,
    password: DEFAULT_AUTH_PASSWORD,
  });
};

const mostrarLogin = async (req, res, next) => {
  try {
    await ensureDefaultUser();
    renderLogin(res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    await ensureDefaultUser();

    const user = String(req.body.user || "").trim();
    const password = String(req.body.password || "").trim();

    const usuario = await Usuario.findOne({ user, password });

    if (!usuario) {
      return res.status(401).render("auth/login", {
        authPage: true,
        authRequired: false,
        error: "Usuario o password incorrectos",
        lastUser: user,
      });
    }

    const safeUser = JSON.stringify(usuario.user);

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
  } catch (error) {
    next(error);
  }
};

module.exports = { mostrarLogin, login };