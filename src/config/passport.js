const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/Usuario");

const DEFAULT_AUTH_USER = process.env.AUTH_USER || "admin";
const DEFAULT_AUTH_PASSWORD = process.env.AUTH_PASSWORD || "admin";

const ensureDefaultUser = async () => {
  const usuarios = await Usuario.estimatedDocumentCount();
  if (usuarios > 0) return;

  await Usuario.create({
    user: DEFAULT_AUTH_USER,
    password: DEFAULT_AUTH_PASSWORD,
  });
};

const generarToken = () => crypto.randomBytes(24).toString("hex");

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
        const usuario = await Usuario.findOne({ user: normalizedUser, password: normalizedPassword });

        if (!usuario) {
          return done(null, false, { message: "Usuario o password incorrectos" });
        }

        usuario.token = generarToken();
        await usuario.save();

        return done(null, {
          id: usuario.id,
          user: usuario.user,
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

    const usuario = await Usuario.findOne({
      _id: sessionUser.id,
      token: sessionUser.token,
    });

    if (!usuario) {
      return done(null, false);
    }

    return done(null, {
      id: usuario.id,
      user: usuario.user,
      token: usuario.token,
    });
  } catch (error) {
    return done(error);
  }
});

module.exports = { passport, ensureDefaultUser };