const { leer, guardar, generarId } = require("../data/db");
const Empleado = require("../models/Empleado");
const { validarEmpleado } = require("../utils/validar");

const crear = (req, res) => {
  const errores = validarEmpleado(req.body);
  if (errores) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(400).json({ errores });
    const { empresaId } = req.params;
    const empresas = leer("empresas");
    const empresa = empresas.find((e) => e.id === empresaId);
    const empleados = leer("empleados").filter((e) => e.empresaId === empresaId).map((d) => new Empleado(d));
    return res.status(400).render("empleados/index", { empleados, empresa, empresaId, errores, modalAbierto: "modal-nuevo" });
  }

  const { empresaId } = req.params;
  const empleados = leer("empleados");
  const nuevoempleado = new Empleado({
    id: generarId("epl", empleados),
    empresaId,
    ...req.body,
  });
  empleados.push(nuevoempleado);
  guardar("empleados", empleados);
  res.redirect(`/empresas/${empresaId}/empleados`);
};

const actualizar = (req, res) => {
  const errores = validarEmpleado(req.body);
  if (errores) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(400).json({ errores });
    const { empresaId } = req.params;
    const empleados = leer("empleados");
    const empresas = leer("empresas");
    const empleado = empleados.find((e) => e.id === req.params.id);
    const empresa = empresas.find((e) => e.id === empresaId);
    return res.status(400).render("empleados/form", {
      empleado,
      empresa,
      empresaId,
      titulo: "Editar Empleado",
      accion: `/empresas/${empresaId}/empleados/${req.params.id}/editar`,
      errores,
    });
  }

  const { empresaId } = req.params;
  const empleados = leer("empleados");
  const idx = empleados.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
  const activo = req.body.activo === "on";
  const empleadoActualizado = new Empleado({ id: req.params.id, ...empleados[idx], ...req.body, activo });
  empleados[idx] = empleadoActualizado;
  guardar("empleados", empleados);
  res.redirect(`/empresas/${empresaId}/empleados`);
};

const eliminar = (req, res) => {
  const { empresaId } = req.params;
  const empleados = leer("empleados");
  const nuevaLista = empleados.filter((e) => e.id !== req.params.id);
  guardar("empleados", nuevaLista);
  res.redirect(`/empresas/${empresaId}/empleados`);
};

const listar = (req, res) => {
  const { empresaId } = req.params;
  const empleadosData = leer("empleados");
  const empresas = leer("empresas");
  const empresa = empresas.find((e) => e.id === empresaId);
  if (!empresa) return res.status(404).json({ error: "Empresa no encontrada" });
  const empleados = empleadosData
    .filter((e) => e.empresaId === empresaId)
    .map((data) => new Empleado(data));
  if (req.accepts('json') && !req.accepts('html')) return res.json(empleados);
  res.render("empleados/index", { empleados, empresa, empresaId });
};

const formularioNuevo = (req, res) => {
  const { empresaId } = req.params;
  const empresas = leer("empresas");
  const empresa = empresas.find((e) => e.id === empresaId);
  if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
  res.render("empleados/form", {
    empleado: null,
    empresa,
    empresaId,
    titulo: "Nuevo Empleado",
    accion: `/empresas/${empresaId}/empleados`,
  });
};

const formularioEditar = (req, res) => {
  const { empresaId } = req.params;
  const empleados = leer("empleados");
  const empresas = leer("empresas");
  const empleado = empleados.find((e) => e.id === req.params.id);
  if (!empleado) return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
  const empresa = empresas.find((e) => e.id === empresaId);
  res.render("empleados/form", {
    empleado,
    empresa,
    empresaId,
    titulo: "Editar Empleado",
    accion: `/empresas/${empresaId}/empleados/${empleado.id}/editar`,
  });
};
const ver = (req, res) => {
  const { empresaId } = req.params;
  const empleados = leer("empleados");
  const empresas = leer("empresas");
  const empleado = empleados.find((e) => e.id === req.params.id && e.empresaId === empresaId);
  if (!empleado) {
    if (req.accepts('json') && !req.accepts('html')) return res.status(404).json({ error: "Empleado no encontrado" });
    return res.status(404).render("404", { mensaje: "Empleado no encontrado" });
  }
  const empresa = empresas.find((e) => e.id === empresaId);
  if (req.accepts('json') && !req.accepts('html')) return res.json(empleado);
  res.render("empleados/detail", { empleado, empresa, empresaId });
};


module.exports = { crear, actualizar, eliminar, listar, ver, formularioNuevo, formularioEditar};
