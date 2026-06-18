require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { connectDB } = require("./config/database");
const { MongoSessionStore } = require("./config/sessionStore");
const { passport } = require("./config/passport");
const { requireAuth } = require("./middlewares/auth.middleware");
const { csrfProtection } = require("./middlewares/csrf.middleware");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/auth.routes");
const empresaRoutes = require("./routes/empresa.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) app.set("trust proxy", 1);

const getSessionSecret = () => {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;

  if (isProduction) {
    throw new Error("SESSION_SECRET es obligatorio en produccion");
  }

  console.warn("Advertencia: usando SESSION_SECRET de desarrollo. Configuralo en .env para mayor seguridad.");
  return "talento-evolutivo-session-secret";
};

// Motor de vistas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: getSessionSecret(),
    store: new MongoSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);
app.use(csrfProtection);
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.get("/", (req, res) => res.redirect("/login"));
app.use(authRoutes);
app.use("/empresas", requireAuth, empresaRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("404", { mensaje: `Ruta no encontrada: ${req.originalUrl}` });
});

// Error handler middleware (debe ser el último)
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
