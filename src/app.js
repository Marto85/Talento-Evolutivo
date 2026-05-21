require("dotenv").config();
const express = require("express");
const path = require("path");
const { connectDB } = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");

const empresaRoutes = require("./routes/empresa.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de vistas Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.get("/", (req, res) => res.redirect("/empresas"));
app.use("/empresas", empresaRoutes);

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
