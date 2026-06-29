require("dotenv").config();
const http = require("http");
const { Server: SocketIO } = require("socket.io");
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
const adminRoutes = require("./routes/admin.routes");
const notifRoutes = require("./routes/notificacion.routes");
const Notificacion = require("./models/Notificacion");

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer);
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
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 30, // 30 minutos de inactividad
    },
  })
);
app.use(csrfProtection);
app.use(passport.initialize());
app.use(passport.session());
app.use(async (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.isAuthenticated = Boolean(req.isAuthenticated && req.isAuthenticated());
  res.locals.authUser = req.user || null;
  res.locals.authUserRole = req.user?.role || null;
  res.locals.authUserId = req.user?.id ? String(req.user.id) : null;

  if (req.user?.id) {
    try {
      res.locals.notificaciones = await Notificacion.find({ destinatarioId: req.user.id, leido: false }).sort({ createdAt: -1 }).limit(20).lean();
    } catch (_) {
      res.locals.notificaciones = [];
    }
  } else {
    res.locals.notificaciones = [];
  }

  next();
});

// Rutas
app.get("/", (req, res) => res.render("home", { homePage: true, authPage: false, authRequired: false }));
app.use(authRoutes);
app.use("/empresas", requireAuth, empresaRoutes);
app.use('/admin', adminRoutes);
app.use('/notificaciones', notifRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("404", { mensaje: `Ruta no encontrada: ${req.originalUrl}` });
});

// Error handler middleware (debe ser el último)
app.use(errorHandler);

// Socket.io — admins se unen a su room al conectar
io.on("connection", (socket) => {
  socket.on("join-admins", () => {
    socket.join("admins");
  });
});

// Exponer io para usarlo en controladores
app.set("io", io);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
