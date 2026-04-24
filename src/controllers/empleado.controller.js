const { leer, guardar, generarId } = require("../data/db");
const Empleado = require("../models/Empleado");

const crear = (req, res) => {
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
  if (!empresa) return res.status(404).render("404", { mensaje: "Empresa no encontrada" });
  const empleados = empleadosData
    .filter((e) => e.empresaId === empresaId)
    .map((data) => new Empleado(data));
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


module.exports = { crear, actualizar, eliminar, listar, formularioNuevo, formularioEditar};
