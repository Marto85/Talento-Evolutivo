const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/Usuario");
const { hashPassword, isPasswordHash, verifyPassword } = require("../utils/password");

const DEFAULT_AUTH_USER = process.env.AUTH_USER || "admin";
const DEFAULT_AUTH_PASSWORD = process.env.AUTH_PASSWORD || "admin";
const JWT_SECRET = process.env.JWT_SECRET || "talento-evolutivo-jwt-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30m";

const ensureDefaultUser = async () => {
  const usuarios = await Usuario.estimatedDocumentCount();
  if (usuarios === 0) {
    await Usuario.create({
      user: DEFAULT_AUTH_USER,
      password: await hashPassword(DEFAULT_AUTH_PASSWORD),
      role: "admin",
    });
    return;
  }

  await Usuario.updateOne(
    {
      user: DEFAULT_AUTH_USER,
      $or: [{ role: { $exists: false } }, { role: null }],
    },
    { role: "admin" }
  );

  await Usuario.updateMany(
    {
      user: { $ne: DEFAULT_AUTH_USER },
      $or: [{ role: { $exists: false } }, { role: null }],
    },
    { role: "empleado" }
  );
};

const generarToken = (usuarioId, usuarioName, usuarioRole) => {
  return jwt.sign(
    { id: usuarioId, user: usuarioName, role: usuarioRole },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "user",
      passwordField: "password",
    },
    async (user, password, done) => {
      try {
        await ensureDefaultUser();

        const normalizedUser = String(user || "").trim();
        const normalizedPassword = String(password || "").trim();
        const usuario = await Usuario.findOne({ user: normalizedUser });

        if (!usuario || !(await verifyPassword(normalizedPassword, usuario.password))) {
          return done(null, false, { message: "Usuario o password incorrectos" });
        }

        if (!isPasswordHash(usuario.password)) {
          usuario.password = await hashPassword(normalizedPassword);
        }

        usuario.token = generarToken(usuario.id, usuario.user, usuario.role);
        await usuario.save();

        return done(null, {
          id: usuario.id,
          user: usuario.user,
          role: usuario.role,
          token: usuario.token,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((authUser, done) => {
  done(null, authUser);
});

passport.deserializeUser(async (sessionUser, done) => {
  try {
    if (!sessionUser || !sessionUser.id || !sessionUser.token) {
      return done(null, false);
    }

    // Verificar que el JWT sea válido
    try {
      const decoded = jwt.verify(sessionUser.token, JWT_SECRET);
      if (decoded.id !== sessionUser.id) {
        return done(null, false);
      }
    } catch (error) {
      // Token expirado o inválido
      return done(null, false);
    }

    const usuario = await Usuario.findById(sessionUser.id);

    if (!usuario) {
      return done(null, false);
    }

    return done(null, {
      id: usuario.id,
      user: usuario.user,
      role: usuario.role,
      token: sessionUser.token,
    });
  } catch (error) {
    return done(error);
  }
});

module.exports = { passport, ensureDefaultUser, JWT_SECRET, JWT_EXPIRES_IN };
