const express = require("express");
const path = require("path");

const empresaRoutes = require("./routes/empresa.routes");
const empleadoRoutes = require("./routes/empleado.routes");

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
app.use("/empleados", empleadoRoutes);

// 404
app.use((req, res) => {
  res.status(404).render("404", { mensaje: `Ruta no encontrada: ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
