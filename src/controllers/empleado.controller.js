const { leer, guardar, generarId } = require("../data/db");
const Empleado = require("../models/Empleado");

const crear = (req, res) => {
  const empleados = leer("empleados");
  const { nombre, apellido, dni, empresaId, puesto, salarioBase } = req.body;
  const nuevoempleado = new Empleado({
    id: generarId("epl", empleados),
    ...req.body,
  });
  empleados.push(nuevoempleado);
  guardar("empleados", empleados);
  res.redirect("/empleados");
};

const actualizar = (req, res) => {
  const empleados = leer("empleados");
  const idx = empleados.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
  const activo = req.body.activo === "on";
  const empleadoActualizado = new Empleado({ id: req.params.id, ...empleados[idx], ...req.body, activo });
  empleados[idx] = empleadoActualizado;
  guardar("empleados", empleados);
  res.redirect("/empleados");
};

const eliminar = (req, res) => {
  const empleados = leer("empleados");
  const nuevaLista = empleados.filter((e) => e.id !== req.params.id);
  guardar("empleados", nuevaLista);
  res.redirect("/empleados");
};

const listar = (req, res) => {
  const empleadosData = leer("empleados");
  const empresas = leer("empresas");
  const empleados = empleadosData.map((data) => {
    const empleado = new Empleado(data);
    const empresa = empresas.find((e) => e.id === empleado.empresaId);
    empleado.empresaNombre = empresa ? empresa.razonSocial : "Desconocida";
    return empleado;
  });
  res.render("empleados/index", { empleados });
};

const formularioNuevo = (req, res) => {
  const empresas = leer("empresas");
  const empresasActivas = empresas.filter(e => e.activa === true);
  res.render("empleados/form", { empleado: null, empresas: empresasActivas, titulo: "Nuevo Empleado", accion: "/empleados" });
};

const formularioEditar = (req, res) => {
  const empleados = leer("empleados");
  const empresas = leer("empresas");
  const empleado = empleados.find((e) => e.id === req.params.id);
  if (!empleado) return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
  res.render("empleados/form", { empleado, empresas, titulo: "Editar Empleado", accion: `/empleados/${empleado.id}/editar` });
};


module.exports = { crear, actualizar, eliminar, listar, formularioNuevo, formularioEditar};
